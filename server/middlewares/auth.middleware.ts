import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../types/auth.type.js'
import { isAdmin } from '../utils/server.authorizer.js'

export const authorizeUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'User not authorized' })
        }

        next()
        
    } catch (error) {
        next(error)
    }
}