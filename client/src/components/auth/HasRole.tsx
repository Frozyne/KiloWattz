import { type ReactNode } from "react";
import { useAuthStore, type UserRole } from "@/storage/useAuthStorage";

interface HasRoleProps {
    roles: UserRole[]
    children: ReactNode
    fallback?: ReactNode
}

export const HasRole = ({ roles, children, fallback = null }: HasRoleProps) => {
    const hasRole = useAuthStore((state) => state.hasRole(roles))
    return hasRole ? <>{children}</> : <>{fallback}</>
}