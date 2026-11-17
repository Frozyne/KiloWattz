import type { IUser } from "./types"

export const isSuperUser = (user?: IUser): boolean => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase()

    if (!user?.email || !adminEmail) {
        return false
    }

    return user.email.trim().toLowerCase() === adminEmail
}