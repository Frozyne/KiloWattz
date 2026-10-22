import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../types/auth.type.ts'

export const authorizeUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        
        // 1. Ensure user is attached to the request (should be done by protectRoute middleware)
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        // 2. Check if the user has the required role (e.g., 'admin')
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'User not authorized' })
        }

        // 3. If user is authenticated and authorized, proceed to the next middleware/controller
        next()
        
    } catch (error) {
        next(error)
    }
}