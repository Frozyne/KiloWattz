import { AuthenticatedRequest } from "../types/auth.type";
import { Response, NextFunction } from "express";
import { ServerError } from "../utils/server.error";
import { ApiResponse } from "../utils/server.success";
import Telemetry, { ITelemetry } from "../models/telemetry.model";
import Household from "../models/household.model";
import { isAdmin } from "../utils/server.authorizer";

interface CommunitySummary {
    solarGeneratedKW: number,
    powerConsumedKW: number,
    batteryLevelPercent: number,
    gridVoltage: number
}

export const getCommunityTelemetry = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const households = await Household.find({ connectionStatus: 'Active' })

        const telemetryData: ITelemetry[] = await Telemetry.aggregate([
        {
            $match: {
                timestamp: { $gte: twentyFourHoursAgo }
            }
        }, {
            $group: {
                _id: { $hour: "$timestamp" },
                solarGeneratedKW: { $avg: "$solarGeneratedKW" },
                powerConsumedKW: { $avg: "$powerConsumedKW" },
                batteryLevelPercent: { $avg: "$batteryLevelPercent" },
                gridVoltage: { $avg: "$gridVoltage" }
            }
        }, {
            $sort: { '_id': 1 }
        }]);

        const summary: CommunitySummary = telemetryData.reduce((acc, curr) => {
            acc.solarGeneratedKW += curr.solarGeneratedKW;
            acc.powerConsumedKW += curr.powerConsumedKW;
            acc.batteryLevelPercent += curr.batteryLevelPercent;
            acc.gridVoltage += curr.gridVoltage;
            return {
                solarGeneratedKW: acc.solarGeneratedKW,
                powerConsumedKW: acc.powerConsumedKW,
                batteryLevelPercent: acc.batteryLevelPercent,
                gridVoltage: acc.gridVoltage,
            };
        }, {
            solarGeneratedKW: 0,
            powerConsumedKW: 0,
            batteryLevelPercent: 0,
            gridVoltage: 0,
        });

        return ApiResponse.success({
            res,
            message: 'Community telemetry data retrieved successfully',
            data: { summary, hourly: telemetryData, activeHouseholds: households.length }
        });

    } catch (error) {
        next(error);
    }
}

export const getHouseholdTelemetry = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const {id: householdId} = req.params;

        const household = await Household.findById(householdId);
        if (!household) {
            return next(new ServerError(`Household with ID ${householdId} not found`, 404));
        }

        if (!household?.user) {
            return next(new ServerError(`Household with ID ${householdId} does not have an associated user`, 404));
        }

        const isOwner = household.user.toString() === req.user?._id.toString();

        if (!isAdmin(req) && !isOwner) {
            return next(new ServerError('Unauthorized access to this household telemetry data', 403));
        }

        const logs = await Telemetry.find({ household: householdId, scope: 'Household' })
            .sort({ timestamp: -1 })
            .limit(50);

        return ApiResponse.success({
            res,
            message: 'Household telemetry data retrieved successfully',
            data: logs
        });

    } catch (error) {
        next(error);
    }
}