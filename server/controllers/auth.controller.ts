import type { NextFunction, Request, Response } from "express"
import bcrypt from 'bcryptjs'
import User from "../models/user.model.js"
import Session from "../models/session.model.js"
import { ServerError } from '../utils/server.error.ts'
import { 
    generateAccessToken,
    generateRefreshToken,
    hashToken,
    verifyRefreshToken 
} from "../utils/jwt.helper.ts"

const COOKIE_OPTIONS = {
    httpOnly: true, // Shields token from XSS attacks (JS cannot read it)
    secure: true, // Requires HTTPS in production
    sameSite: "none" as boolean | "none" | "strict" | "lax" | undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
}

export const signIn = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body

        if(!email || !password) {
            const error = new ServerError('Missing Credentials', 400) 
            throw error
        }

        const user = await User.findOne({email}).select('+password')
        
        if(!user) {
            const error = new ServerError('User not found', 404)
            throw error
        }

        const isPasswordValid = await bcrypt.compare(password, user.password!)

        if(!isPasswordValid) {
            const error = new ServerError('Invalid Credential', 401)
            throw error
        }
        const refreshToken = generateRefreshToken(user._id.toString())
        const refreshTokenHash = hashToken(refreshToken)

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const newSession = await Session.create({
            userId: user._id,
            token: refreshToken,
            tokenHash: refreshTokenHash,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            expiresAt,
        })

        const accessToken = generateAccessToken(user._id.toString(), user.role, newSession._id.toString())

        res
        .cookie('token', refreshToken, COOKIE_OPTIONS)
        .status(200)
        .json({
            success: true,
            message: 'User created successfully',
            data: {
                accessToken, 
                user: {
                    id: user._id,
                    name: user.fullName,
                    email: user.email,
                    role: user.role,
                }}
        })

    } catch (error) {
        next(error)
    }
}

export const signOut =  async(req: Request, res: Response, next: NextFunction) => {
    try {
        
        const authHeader = req.headers.authorization

        if(!authHeader?.startsWith('Bearer ')) {
            return next(new ServerError('No token provided', 404))
        }

        const token = authHeader?.split(' ')[1]

        const deletedSession = await Session.findOneAndDelete({token})

        if(!deletedSession) {
            return res.status(200).json({
                success: true,
                message: 'Already signed out'
            })
        }

        return res
        .clearCookie('token', COOKIE_OPTIONS)
        .status(200)
        .json({
            success: true,
            message: 'User signed out successfully'
        })

    } catch (error) {
        next(error)
    }
}

export const handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const incomingRefreshToken = req.cookies?.token

        if (!incomingRefreshToken) {
            return res.status(401).json({ message: 'Refresh token missing' })
        }

        // 1. Verify token signature
        let payload: { userId: string }
        try {
            payload = verifyRefreshToken(incomingRefreshToken)
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' })
        }

        const tokenHash = hashToken(incomingRefreshToken)

        // 2. Query session in database
        const session = await Session.findOne({
            userId: payload.userId,
            token: tokenHash,
        })

        // Reuse Attack Guard: If token signature is valid but no matching active session exists,
        // invalidate ALL sessions for this user for security.
        if (!session || session.isRevoked) {
            await Session.updateMany({ userId: payload.userId }, { isRevoked: true })
            res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' })
            return res.status(403).json({ message: 'Security alert: Invalid session context. Please log in again.' })
        }

        // 3. Retrieve User Data
        const user = await User.findById(payload.userId).select('-password')
        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' })
        }

        // 4. Generate new Token Pair (Token Rotation)
        const newAccessToken = generateAccessToken(user._id.toString(), user.role, session._id.toString())
        const newRefreshToken = generateRefreshToken(user._id.toString())
        const newRefreshTokenHash = hashToken(newRefreshToken)

        // 5. Update session in MongoDB with rotated hash
        session.token = newRefreshToken
        session.tokenHash = newRefreshTokenHash
        session.ipAddress = req.ip
        session.userAgent = req.get('user-agent')
        await session.save()

        // 6. Set rotated refresh token in secure HTTP-Only cookie
        res.cookie('token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

        // 7. Send back new short-lived access token
        return res.status(200).json({
            status: 'success',
            data: {
                accessToken: newAccessToken,
                user: {
                    id: user._id,
                    name: user.fullName,
                    email: user.email,
                    role: user.role,
                },
            },
        })
    } catch (error) {
        next(error)
    }
}