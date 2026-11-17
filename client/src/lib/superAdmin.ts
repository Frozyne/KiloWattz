import type { IUser } from "./types"

export const isSuperUser = (user?: IUser): boolean => {
    if (!user) {
        return false
    }

    if (user.email !== import.meta.env.ADMIN_EMAIL) {
            return false
        }

    return true
}