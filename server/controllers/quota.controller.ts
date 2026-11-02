import { Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import Household from '../models/household.model'
import Telemetry from '../models/telemetry.model'
import { AuthenticatedRequest } from '../types/auth.type'
import { ApiResponse } from '../utils/server.success'
import { ServerError } from '../utils/server.error'
import { isAdmin } from '../utils/server.authorizer'

export const getTodayQuotaStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { householdId } = req.params as { householdId: string }

        const household = await Household.findById(householdId)
        if (!household) {
            throw new ServerError(`Household with ID ${householdId} not found`, 404)
        }

        const isOwner = household.user?.toString() === req.user?._id.toString()

        if (!isAdmin(req) && !isOwner) {
            throw new ServerError('Unauthorized access to household quota details', 403)
        }

        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const todayUsageAggregation = await Telemetry.aggregate([
            {
                $match: {
                    household: new mongoose.Types.ObjectId(householdId),
                    scope: 'Household',
                    timestamp: { $gte: startOfDay }
                }
            },
            {
                $group: {
                    _id: '$household',
                    minReading: { $min: '$energyConsumedKWh' },
                    maxReading: { $max: '$energyConsumedKWh' }
                }
            },
            {
                $project: {
                    totalTodayKWh: { $subtract: ['$maxReading', '$minReading'] }
                }
            }
        ])

        const currentUsageKWh = todayUsageAggregation[0]?.totalTodayKWh || 0
        const baseQuotaKWh = household.dailyKWHQuota

        const remainingLimitKWh = Math.max(0, baseQuotaKWh - currentUsageKWh)
        const isQuotaBreached = currentUsageKWh >= baseQuotaKWh

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: "Today's quota metrics retrieved successfully",
            data: {
                householdId: household._id,
                connectionStatus: household.connectionStatus,
                baseQuotaKWh,
                currentUsageKWh: Math.round(currentUsageKWh * 100) / 100,
                remainingLimitKWh: Math.round(remainingLimitKWh * 100) / 100,
                isQuotaBreached
            }
        })

    } catch (error) {
        next(error)
    }
}

export const setQuotaLimitByPhase = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { phase, dailyKWHQuota } = req.body
        
        if (!phase || !dailyKWHQuota) {
            throw new ServerError('Missing required fields (phase, dailyKWHQuota)', 400)
        }

        const validPhases = ['Phase 1' , 'Phase 2' , 'Phase 3']

        if (!validPhases.includes(phase)) {
            throw new ServerError('Invalid phase specified', 400)
        }

        const updateResult = await Household.updateMany(
            { phaseConnection: phase },
            { $set: { dailyKWHQuota } }
        )

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: "Quota limits updated successfully",
            data: updateResult
        })
    } catch (error) {
        next(error)
    }
}