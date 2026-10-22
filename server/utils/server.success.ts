import { Response } from 'express'

interface SuccessOptions<T> {
    res: Response
    statusCode?: number
    message: string
    data?: T
    meta?: Record<string, any> // Useful for pagination info like totalPages, page, count
}

export class ApiResponse {
    static success<T>({ res, statusCode = 200, message, data, meta }: SuccessOptions<T>) {
        return res.status(statusCode).json({
            success: true,
            message,
            ...(data !== undefined && { data }),
            ...(meta !== undefined && { meta })
        })
    }
}