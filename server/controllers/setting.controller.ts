import { Response, NextFunction } from 'express'
import Household from '../models/household.model'
import Setting from '../models/setting.model'
import { AuthenticatedRequest } from '../types/auth.type'
import { ApiResponse } from '../utils/server.success'
import { ServerError } from '../utils/server.error'

export const updateGlobalDailyQuota = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { globalDailyQuotaKWh } = req.body

        if (typeof globalDailyQuotaKWh !== 'number' || globalDailyQuotaKWh <= 0) {
            throw new ServerError('Please provide a valid numeric global daily quota in kWh', 400)
        }

        const bulkUpdateResult = await Household.updateMany(
            {},
            { $set: { dailyQuotaKWh: globalDailyQuotaKWh } }
        )

        await Setting.findOneAndUpdate(
            { key: 'defaultDailyQuotaKWh' },
            { 
                value: globalDailyQuotaKWh, 
                description: 'Default daily electricity quota per household in kWh' 
            },
            { upsert: true, new: true }
        )

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: `Global daily quota updated to ${globalDailyQuotaKWh} kWh across all households`,
            data: {
                globalDailyQuotaKWh,
                matchedHouseholds: bulkUpdateResult.matchedCount,
                modifiedHouseholds: bulkUpdateResult.modifiedCount
            }
        })

    } catch (error) {
        next(error)
    }
}