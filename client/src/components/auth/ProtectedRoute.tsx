import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore, type UserRole } from '../../storage/useAuthStorage'

interface ProtectedRouteProps {
    allowedRoles?: UserRole[]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuthStore()
    const location = useLocation()

    // 1. Unauthenticated users redirected to Login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // 2. Role-Based Access Control (RBAC) check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    // 3. Authorized -> Render requested child route
    return <Outlet />
}