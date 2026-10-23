import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth.type.ts";
import Household from "../models/household.model.ts";
import User from "../models/user.model.ts";
import mongoose from "mongoose";
import { ServerError } from "../utils/server.error.ts";
import { ApiResponse } from "../utils/server.success.ts";

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
            data: { households }
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

        const isAdmin = req.user?.role === 'admin';

        const isOwner = ownerId === req.user?._id.toString();

        if (!isAdmin && !isOwner) {
            return next(new ServerError('Unauthorized access to this household', 403));
        }

        if (!household) {
            return next(new ServerError(`Household with ID ${householdId} not found`, 404));
        }

        return ApiResponse.success({
            res,
            message: 'Household retrieved successfully',
            data: { household }
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
            data: { households },
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
    const { plotNumber, street, dailyKWHQuota, connectionStatus, meterSerialNumber, phaseConnection, user } = req.body;
        
        
    if (!plotNumber || !street || !dailyKWHQuota || !connectionStatus || !phaseConnection || !user) {
        return next(new ServerError('Missing required fields', 400));
    }

    const existingUser = await User.findById(user);
    if (!existingUser) {
        return next(new ServerError('User not found', 404));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const household = new Household({
            plotNumber,
            street,
            dailyKWHQuota,
            connectionStatus,
            meterSerialNumber,
            phaseConnection,
            user: existingUser._id
        }, { session });

        await household.save();

        existingUser.households.push(household._id);
        await existingUser.save({session});

        await session.commitTransaction();
        await session.endSession();

        return ApiResponse.success({
            res,
            statusCode: 201,
            message: 'Household created successfully',
            data: { household }
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

        const { plotNumber, street, dailyKWHQuota, connectionStatus, meterSerialNumber, phaseConnection } = req.body;

        if (!plotNumber && !street && !dailyKWHQuota && !connectionStatus && !meterSerialNumber && !phaseConnection) {
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
            { plotNumber, street, dailyKWHQuota, connectionStatus, meterSerialNumber, phaseConnection },
            { new: true, runValidators: true }
        ).populate('user', 'fullName email avatarUrl');

        if (!household) {
            return next(new ServerError('Household not found', 404));
        }

        return ApiResponse.success({
            res,
            message: 'Household updated successfully',
            data: { household }
        });
    } catch (error) {
        next(error);
    }
}

export const deleteHousehold = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const householdId = req.params.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const household = await Household.findById(householdId).session(session);

        if (!household) {
            return next(new ServerError('Household not found', 404));
        }

        const user = await User.findById(household.user).session(session);

        if (!user) {
            return next(new ServerError('Associated user not found', 404));
        }

        await User.findByIdAndUpdate(user._id, { $pull: { households: household._id } }, { session });

        await Household.findByIdAndDelete(householdId, { session });

        await session.commitTransaction();
        await session.endSession();

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        next(error);
    }
}