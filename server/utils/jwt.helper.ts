import jwt, { SignOptions } from 'jsonwebtoken'
import crypto from 'crypto'

const accessExpiresInSetting = (process.env.JWT_ACCESS_EXPIRES_IN || '1d') as SignOptions['expiresIn']
const refreshExpiresInSetting = (process.env.JWT_REFRESH_EXPIRES_IN || '3m') as SignOptions['expiresIn']

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-super-secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-super-secret'

export const generateAccessToken = (userId: string, role: string): string => {
    return jwt.sign({ userId, role }, ACCESS_SECRET, { expiresIn: accessExpiresInSetting })
}

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: refreshExpiresInSetting })
}

export const hashToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex')
}

export const verifyRefreshToken = (token: string): { userId: string } => {
    return jwt.verify(token, REFRESH_SECRET) as { userId: string }
}