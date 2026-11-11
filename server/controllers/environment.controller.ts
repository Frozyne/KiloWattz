import { Response, NextFunction } from 'express'
import Environment from '../models/environment.model'
import { AuthenticatedRequest } from '../types/auth.type'
import { ApiResponse } from '../utils/server.success'

export const getLatestEnvironment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const latest = await Environment.findOne().sort({ timestamp: -1 })

        if (!latest) {
            return ApiResponse.success({
                res,
                statusCode: 200,
                message: 'No environment telemetry recorded yet',
                data: {
                    solarIrradianceWm2: 0,
                    cloudCoverPercent: 0,
                    ambientTempCelsius: 25,
                    timestamp: new Date()
                }
            });
        }

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: 'Latest environmental metrics retrieved',
            data: latest
        })
    } catch (error: any) {
        console.error('[ENVIRONMENT CONTROLLER ERROR]:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while fetching environment data',
        })
    }
}
