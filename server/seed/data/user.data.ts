import type {IUser} from '../../models/user.model'

export interface SeedUser {
    name: string,
    email: string,
    password: string,
    role?: string
}

function requireEnv(key: string): string {
    const value = process.env[key] 
    if (!value) {
        throw new Error(`Missing ${key} in your env file`
        )
    }
    return value
}

export function getSeedUser(): SeedUser[] {
    return [
        {
            name: process.env.ADMIN_NAME ?? 'Super Admin',
            email: requireEnv('ADMIN_EMAIL'),
            password: requireEnv('ADMIN_PASSWORD'),
            role: 'admin'
        },
    ]
}