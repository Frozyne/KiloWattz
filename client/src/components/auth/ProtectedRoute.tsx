import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore, type UserRole } from '../../storage/useAuthStorage'

interface ProtectedRouteProps {
    allowedRoles?: UserRole[]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuthStore()
    const location = useLocation()
    const [isHydrated, setIsHydrated] = useState(() => useAuthStore.persist.hasHydrated())

    useEffect(() => {
        // Wait until Zustand persist middleware finishes loading from localStorage
        const unsub = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true))
        setIsHydrated(useAuthStore.persist.hasHydrated())
        return () => unsub()
    }, [])

    // 1. Render a fallback while checking localStorage session state
    if (!isHydrated) {
        return null 
    }

    // 2. Unauthenticated users redirected to Login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // 3. Role-Based Access Control (RBAC) check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    // 4. Authorized -> Render requested child route
    return <Outlet />
}