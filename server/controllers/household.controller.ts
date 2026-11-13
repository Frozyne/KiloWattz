import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/auth.type.js";
import Household from "../models/household.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { ServerError } from "../utils/server.error.js";
import { ApiResponse } from "../utils/server.success.js";
import { isAdmin } from "../utils/server.authorizer.js";
import { isValidMeterNumber } from "../utils/meter.helper.js";
import { recalculateAllHouseholdQuotas } from "../services/quota.service.js";

export const getMyHouseholds = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ServerError('User not found', 404));
        }
        const userId = req.user._id;

        const households = await Household
            .find({ user: userId })
            .populate('user', 'fullName email')
            .populate('quotaRecord', 'allocatedQuotaKWh consumedKWh quotaBreached');

        return ApiResponse.success({
            res,
            message: 'Households retrieved successfully',
            data: households
        });
    } catch (error) {
        next(error);
    }
};

export const getHouseholdById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const householdId = req.params.id;

        const household = await Household.findById(householdId)
            .populate('user', 'fullName email')
            .populate('quotaRecord', 'allocatedQuotaKWh consumedKWh quotaBreached');

        if(!household?.user) {
            return next(new ServerError(`Household with ID ${householdId} not found`, 404));
        }

        const ownerId = household?.user._id ? household.user._id.toString() : household?.user.toString();

        const isOwner = ownerId === req.user?._id.toString();

        if (!isAdmin(req) && !isOwner) {
            return next(new ServerError('Unauthorized access to this household', 403));
        }

        if (!household) {
            return next(new ServerError(`Household with ID ${householdId} not found`, 404));
        }

        return ApiResponse.success({
            res,
            message: 'Household retrieved successfully',
            data: household
        });

    } catch (error) {
        next(error);
    }
};

export const getAllHouseholds = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const page = Number.parseInt(req.query.page as string) || 1;
        const limit = Number.parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const {search, connectionStatus} = req.query as { search?: string; connectionStatus?: string };

        const filterQuery: Record<string, any> = {};

        if (connectionStatus) {
            filterQuery.connectionStatus = connectionStatus;
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filterQuery.$or = [
                { plotNumber: { $regex: searchRegex } },
                { street: { $regex: searchRegex } },
                { meterSerialNumber: { $regex: searchRegex } },
            ];
        }

        const [households, totalHouseholds] = await Promise.all([
            Household.find(filterQuery)
                .skip(skip)
                .limit(limit)
                .populate('user', 'fullName email avatarUrl')
                .populate('quotaRecord', 'allocatedQuotaKWh consumedKWh quotaBreached'),
            Household.countDocuments(filterQuery)
        ]);

        return ApiResponse.success({
            res,
            message: 'Households retrieved successfully',
            data: households,
            meta: {
                total: totalHouseholds,
                page,
                limit,
                totalPages: Math.ceil(totalHouseholds / limit)
            }
        });
    } catch (error) {
        next(error);
    }
}

export const createHousehold = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const { plotNumber, street, meterSerialNumber, phaseConnection, userID } = req.body;
        
        
    if (!plotNumber || !street || !phaseConnection || !userID) {
        return next(new ServerError('Missing required fields', 400));
    }

    const existingUser = await User.findById(userID);
    if (!existingUser) {
        return next(new ServerError('User not found', 404));
    }

    const meterSerialNumberExists = await Household.findOne({ meterSerialNumber });
    if (meterSerialNumberExists) {
        return next(new ServerError('Meter serial number is already in use', 400));
    }

    if (!isValidMeterNumber(meterSerialNumber)) {
        return next(new ServerError('Invalid meter serial number', 400));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const household = new Household({
            plotNumber: plotNumber,
            street: street,
            meterSerialNumber: meterSerialNumber,
            phaseConnection: phaseConnection,
            user: existingUser._id
        });

        await household.save({ session });

        await recalculateAllHouseholdQuotas()

        existingUser.households.push(household._id);
        await existingUser.save({session});

        await session.commitTransaction();
        await session.endSession();

        return ApiResponse.success({
            res,
            statusCode: 201,
            message: 'Household created successfully',
            data: household
        });

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        next(error);
    }
}

export const updateHousehold = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const householdId = req.params.id;

        const { plotNumber, street, meterSerialNumber, phaseConnection } = req.body;

        if (!plotNumber && !street && !meterSerialNumber && !phaseConnection) {
            return next(new ServerError('No data provided for update', 400));
        }

        const plotNumberExists = plotNumber ? await Household.findOne({ plotNumber }) : null;

        if (plotNumberExists && plotNumberExists._id.toString() !== householdId) {
            return next(new ServerError('Plot number is already in use', 400));
        }

        const meterSerialNumberExists = meterSerialNumber ? await Household.findOne({ meterSerialNumber }) : null;

        if (meterSerialNumberExists && meterSerialNumberExists._id.toString() !== householdId) {
            return next(new ServerError('Meter serial number is already in use', 400));
        }

        const household = await Household.findByIdAndUpdate(
            householdId,
            { plotNumber, street, meterSerialNumber, phaseConnection },
            { new: true, runValidators: true }
        ).populate('user', 'fullName email avatarUrl');

        if (!household) {
            return next(new ServerError('Household not found', 404));
        }

        return ApiResponse.success({
            res,
            message: 'Household updated successfully',
            data: household
        });
    } catch (error) {
        next(error);
    }
}

export const updateHouseholdStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const { connectionStatus } = req.body // 'Active' | 'Disconnected' | 'Suspended'

        if (!['Active', 'Disconnected', 'Suspended'].includes(connectionStatus)) {
            return res.status(400).json({ message: 'Invalid connection status value' })
        }

        const household = await Household.findByIdAndUpdate(
            id,
            { connectionStatus },
            { new: true }
        )

        if (!household) {
            return res.status(404).json({ message: 'Household record not found' })
        }

        // Trigger quota recalculation across the grid
        const updatedQuota = await recalculateAllHouseholdQuotas()

        return res.status(200).json({
            status: 'success',
            data: {
                household,
                gridDailyQuotaPerHousehold: updatedQuota,
            },
        })
    } catch (error) {
        next(error)
    }
}

export const deleteHousehold = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        const household = await Household.findByIdAndDelete(id)

        if (!household) {
            return res.status(404).json({ message: 'Household record not found' })
        }

        // Redistribute capacity among remaining households
        const updatedQuota = await recalculateAllHouseholdQuotas()

        return res.status(200).json({
            status: 'success',
            message: 'Household deleted successfully',
            data: {
                deletedHouseholdId: id,
                gridDailyQuotaPerHousehold: updatedQuota,
            },
        })
    } catch (error) {
        next(error)
    }
}

export const ToggleTerminalConnection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const householdId = req.params.id;
        const { terminalNumber, connectionStatus } = req.body;

        if (!terminalNumber || !connectionStatus) {
            return next(new ServerError('Missing required fields', 400));
        }

        const household = await Household.findById(householdId);

        if (!household) {
            return next(new ServerError('Household not found', 404));
        }

        const terminalKey = `terminal${terminalNumber}` as keyof typeof household.meter;

        if (!household.meter[terminalKey]) {
            return next(new ServerError(`Terminal ${terminalNumber} does not exist`, 400));
        }

        household.meter[terminalKey].connectionStatus = connectionStatus;
        await household.save();
        
        return ApiResponse.success({
            res,
            message: 'Terminal connection status updated successfully',
            data: { household }
        });
    } catch (error) {
        next(error);
    }
}