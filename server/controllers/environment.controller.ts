import { Response, NextFunction } from 'express'
import Environment from '../models/environment.model'
import { AuthenticatedRequest } from '../types/auth.type'
import { ApiResponse } from '../utils/server.success'

export const getLatestEnvironment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const latest = await Environment.findOne().sort({ timestamp: -1 }).exec()

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: 'Latest environmental metrics retrieved',
            data: { environment: latest }
        })
    } catch (error) {
        next(error)
    }
}