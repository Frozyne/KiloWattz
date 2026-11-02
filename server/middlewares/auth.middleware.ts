import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../types/auth.type.ts'
import { isAdmin } from '../utils/server.authorizer.ts'

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