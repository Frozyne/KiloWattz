import { type ReactNode } from "react"
import { useAuthStore, type UserRole } from "@/storage/useAuthStorage"

interface HasRoleProps {
    roles: UserRole[]
    children: ReactNode
    fallback?: ReactNode
}

export const HasRole = ({ roles, children, fallback = null }: HasRoleProps) => {
    const user = useAuthStore((state) => state.user)
    
    const canAccess = user ? roles.includes(user.role) : false

    return canAccess ? <>{children}</> : <>{fallback}</>
}