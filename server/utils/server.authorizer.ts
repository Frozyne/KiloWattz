import { AuthenticatedRequest } from '../types/auth.type.ts'

export const isSuperUser = (req: AuthenticatedRequest): boolean => {
    if (!req.user) {
        return false
    }

    if (req.user.email !== process.env.ADMIN_EMAIL) {
            return false
        }

    if (req.user.password !== process.env.ADMIN_PASSWORD) {
        return false
    }

    return true
}

export const isAdmin = (req: AuthenticatedRequest): boolean => {
    if (!req.user) {
            return false
        }

    if (req.user.role !== 'admin') {
        return false
    }

    return true
}