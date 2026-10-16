import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/user.model.ts'
import Session from '../models/session.model.ts'
import { ServerError } from '../utils/server.error.ts'

// Type definition for JWT Payload
interface DecodedToken extends JwtPayload {
    userId: string
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Extract token from HttpOnly Cookie first, fallback to Bearer header
        let token = req.cookies?.token

        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            throw new ServerError('No token provided, please log in', 401)
        }

        // 2. Verify JWT signature
        const secret = process.env.JWT_SECRET
        if (!secret) {
            throw new ServerError('JWT_SECRET is missing in environment variables', 500)
        }

        const decoded = jwt.verify(token, secret) as DecodedToken

        // 3. Check if active session exists in MongoDB (Handles revoked/logged-out sessions)
        const activeSession = await Session.findOne({ token })
        if (!activeSession) {
            throw new ServerError('Session ended, please log in again', 401)
        }

        // 4. Verify user exists in DB (Excludes password field for security)
        const user = await User.findById(decoded.userId).select('-password')
        if (!user) {
            throw new ServerError('User no longer exists', 404)
        }

        // 5. Attach full user object to the request
        req.user = user
        next()

    } catch (error) {
        next(error)
    }
}