import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../types/auth.type.ts'
import { isSuperUser } from '../utils/server.authorizer.ts'

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