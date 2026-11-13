import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../types/auth.type.js'
import { isSuperUser } from '../utils/server.authorizer.js'

export const authorizeSuperUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        
        if (!isSuperUser(req)) {
            return res.status(403).json({ message: 'User not authorized' })
        }
        
        next()
        
    } catch (error) {
        next(error)
    }
}