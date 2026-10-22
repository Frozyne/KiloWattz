import { Response, NextFunction } from 'express'
import Setting from '../models/setting.model'
import { AuthenticatedRequest } from '../types/auth.type.ts'
import { ApiResponse } from '../utils/server.success.ts'
import { ServerError } from '../utils/server.error.ts'

export const updateGridTariff = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { tariff } = req.body

        if (typeof tariff !== 'number' || tariff <= 0) {
            throw new ServerError('Please provide a valid tariff rate per kWh', 400)
        }

        // Upsert creates the setting if missing, or updates it if present
        const updatedSetting = await Setting.findOneAndUpdate(
            { key: 'gridTariffPerKWh' },
            { value: tariff, description: 'Standard utility DisCo rate per kWh in naira' },
            { new: true, upsert: true, runValidators: true }
        )

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: 'Grid tariff updated successfully',
            data: { gridTariffPerKWh: updatedSetting.value }
        })
    } catch (error) {
        next(error)
    }
}