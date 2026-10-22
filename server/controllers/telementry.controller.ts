import { AuthenticatedRequest } from "../types/auth.type";
import { Response, NextFunction } from "express";
import { ServerError } from "../utils/server.error";
import { ApiResponse } from "../utils/server.success";
import Setting from "../models/setting.model";
import Telemetry from "../models/telementry.model";
import Household from "../models/household.model";
import mongoose from "mongoose";

export const getCommunityTelemetry = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const telemetryData = await Telemetry.aggregate([
        {
            $match: {
                scope: 'Community',
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

        const summary = telemetryData.reduce((acc, curr) => {
            acc.solarGeneratedKW += curr.solarGeneratedKW;
            acc.powerConsumedKW += curr.powerConsumedKW;
            acc.batteryLevelPercent += curr.batteryLevelPercent;
            acc.gridVoltage += curr.gridVoltage;
            return acc;
        }, {
            solarGeneratedKW: 0,
            powerConsumedKW: 0,
            batteryLevelPercent: 0,
            gridVoltage: 0
        });

        return ApiResponse.success({
            res,
            message: 'Community telemetry data retrieved successfully',
            data: { summary, hourly: telemetryData }
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

        const isAdmin = req.user?.role === 'admin';
        const isOwner = household.user.toString() === req.user?._id.toString();

        if (!isAdmin && !isOwner) {
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

const DEFAULT_GRID_TARIFF_PER_KWH = 225

export const getHouseholdSavings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const tarrifSetting = await Setting.findOne({ key: 'gridTariffPerKWh' });
        const gridTariffPerKWh = tarrifSetting ? tarrifSetting.value : DEFAULT_GRID_TARIFF_PER_KWH;

        const {id: householdId} = req.params;

        const household = await Household.findById(householdId);
        if (!household) {
            return next(new ServerError(`Household with ID ${householdId} not found`, 404));
        }

        const isAdmin = req.user?.role === 'admin';
        const isOwner = household.user.toString() === req.user?._id.toString();

        if (!isAdmin && !isOwner) {
            return next(new ServerError('Unauthorized access to this household savings data', 403));
        }

        const [estateTotals, householdTotals] = await Promise.all([
            // Aggregate TOTAL generation and consumption across ALL meters
            Telemetry.aggregate([
                {
                    $group: {
                        _id: null,
                        solarConsumedKWh: { $sum: '$solarGeneratedKWh' },
                        powerConsumedKWh: { $sum: '$energyConsumedKWh' }
                    }
                }
            ]),
            // Aggregate consumption for THIS SPECIFIC household
            Telemetry.aggregate([
                { $match: { household: new mongoose.Types.ObjectId(householdId as string), scope: 'Household' } },
                {
                    $group: {
                        _id: null,
                        solarConsumedKWh: { $sum: '$energyConsumedKWh' }
                    }
                }
            ])
        ])

        const totalEstateSolar = estateTotals[0]?.solarConsumedKWh || 0
        const totalEstateConsumed = estateTotals[0]?.powerConsumedKWh || 0
        const totalHouseholdConsumed = householdTotals[0]?.solarConsumedKWh || 0

        // 4. Calculate Estate Solar Coverage Ratio (capped at 100%)
        const solarCoverageRatio = totalEstateConsumed > 0 
            ? Math.min(1, totalEstateSolar / totalEstateConsumed) 
            : 0

        // 5. Calculate Household Allocation & Financials
        const allocatedSolarKWh = totalHouseholdConsumed * solarCoverageRatio
        const netGridDrawKWh = totalHouseholdConsumed - allocatedSolarKWh

        const baselineGridCostNaira = totalHouseholdConsumed * gridTariffPerKWh
        const actualGridBillNaira = netGridDrawKWh * gridTariffPerKWh
        const totalSavedNaira = allocatedSolarKWh * gridTariffPerKWh

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: 'Household savings calculated successfully based on estate solar allocation',
            data: {
                metrics: {
                    householdConsumptionKWh: totalHouseholdConsumed,
                    allocatedSolarKWh: Math.round(allocatedSolarKWh * 100) / 100,
                    netGridDrawKWh: Math.round(netGridDrawKWh * 100) / 100,
                    estateSolarCoveragePercent: Math.round(solarCoverageRatio * 100),
                    gridTariffUsedNaira: gridTariffPerKWh,
                    financials: {
                        baselineGridCostNaira: Math.round(baselineGridCostNaira),
                        actualGridBillNaira: Math.round(actualGridBillNaira),
                        totalSavedNaira: Math.round(totalSavedNaira)
                    }
                }
            }
        })
    } catch (error) {
        next(error);
    }
}