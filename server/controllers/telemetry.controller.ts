import type { AuthenticatedRequest } from "../types/auth.type.js";
import type { Response, NextFunction } from "express";
import { ServerError } from "../utils/server.error.js";
import { ApiResponse } from "../utils/server.success.js";
import Telemetry, { type ITelemetry } from "../models/telemetry.model.js";
import Household from "../models/household.model.js";
import { isAdmin } from "../utils/server.authorizer.js";

interface CommunitySummary {
    solarGeneratedKW: number
    powerConsumedKW: number
    batteryLevelPercent: number
    gridVoltage: number
    liveGridVoltage: number
    liveBatteryPercent: number
    liveSolarGeneratedKW: number
    livePowerConsumedKW: number
}

export const getCommunityTelemetry = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const households = await Household.find({ connectionStatus: 'Active' })

        // 1. 24-hour hourly breakdown
        const telemetryData: ITelemetry[] = await Telemetry.aggregate([
            {
                $match: {
                    timestamp: { $gte: twentyFourHoursAgo }
                }
            },
            {
                $group: {
                    _id: { $hour: "$timestamp" },
                    solarGeneratedKW: { $avg: "$solarGeneratedKW" },
                    powerConsumedKW: { $avg: "$powerConsumedKW" },
                    batteryLevelPercent: { $avg: "$batteryLevelPercent" },
                    gridVoltage: { $avg: "$gridVoltage" }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ])

        // 2. Latest live reading across all active households (most recent entry per household)
        const latestReadings = await Telemetry.aggregate([
            {
                $match: {
                    timestamp: { $gte: twentyFourHoursAgo }
                }
            },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: "$household",
                    latestVoltage: { $first: "$gridVoltage" },
                    latestBattery: { $first: "$batteryLevelPercent" },
                    latestSolarKW: { $first: "$solarGeneratedKW" },
                    latestConsumedKW: { $first: "$powerConsumedKW" }
                }
            },
            {
                $group: {
                    _id: null,
                    liveGridVoltage: { $avg: "$latestVoltage" },
                    liveBatteryPercent: { $avg: "$latestBattery" },
                    liveSolarGeneratedKW: { $avg: "$latestSolarKW" },
                    livePowerConsumedKW: { $sum: "$latestConsumedKW" }
                }
            }
        ])

        const live = latestReadings[0]
        const count = telemetryData.length

        const totals = telemetryData.reduce(
            (acc, curr) => ({
                solarGeneratedKW: acc.solarGeneratedKW + curr.solarGeneratedKW,
                powerConsumedKW: acc.powerConsumedKW + curr.powerConsumedKW,
                batteryLevelPercent: acc.batteryLevelPercent + curr.batteryLevelPercent,
                gridVoltage: acc.gridVoltage + curr.gridVoltage,
            }),
            {
                solarGeneratedKW: 0,
                powerConsumedKW: 0,
                batteryLevelPercent: 0,
                gridVoltage: 0,
            }
        )

        const summary: CommunitySummary = count > 0
            ? {
                solarGeneratedKW: Math.round((totals.solarGeneratedKW / count) * 100) / 100,
                powerConsumedKW: Math.round((totals.powerConsumedKW / count) * 100) / 100,
                batteryLevelPercent: Math.round((totals.batteryLevelPercent / count) * 10) / 10,
                gridVoltage: Math.round((totals.gridVoltage / count) * 10) / 10,
                liveGridVoltage: Math.round((live?.liveGridVoltage ?? 0) * 10) / 10,
                liveBatteryPercent: Math.round((live?.liveBatteryPercent ?? 0) * 10) / 10,
                liveSolarGeneratedKW: Math.round((live?.liveSolarGeneratedKW ?? 0) * 100) / 100,
                livePowerConsumedKW: Math.round((live?.livePowerConsumedKW ?? 0) * 100) / 100,
            }
            : {
                ...totals,
                liveGridVoltage: 0,
                liveBatteryPercent: 0,
                liveSolarGeneratedKW: 0,
                livePowerConsumedKW: 0,
            }

        return ApiResponse.success({
            res,
            message: 'Community telemetry data retrieved successfully',
            data: { summary, hourly: telemetryData, activeHouseholds: households.length }
        })

    } catch (error) {
        next(error)
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

        const logs = await Telemetry.find({ household: householdId })
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