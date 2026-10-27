import { NextFunction, Request, Response } from "express"
import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'
import User from "../models/user.model"
import Session from "../models/session.model"
import { ServerError } from '../utils/server.error.ts'

const COOKIE_OPTIONS = {
    httpOnly: true, // Shields token from XSS attacks (JS cannot read it)
    secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
    sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
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
        
        const secret = process.env.JWT_SECRET
        const expiresInSetting = (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn']

        if(!secret) {
            const error =  new ServerError('JWT SECRET is missing in enviroment variables', 404)
            throw error
        }

        const token = jwt.sign(
            {userId: user._id}, 
            secret, 
            {expiresIn: expiresInSetting}
        )

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        await Session.create(
            [{userId: user._id, token, expiresAt}]
        )

        const userToReturn = user.toObject()
        delete userToReturn.password

        res
        .cookie('token', token, COOKIE_OPTIONS)
        .status(200)
        .json({
            success: true,
            message: 'User created successfully',
            data: {token, user: userToReturn}
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