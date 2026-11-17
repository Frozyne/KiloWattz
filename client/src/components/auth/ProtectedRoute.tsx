import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore, type UserRole } from '../../storage/useAuthStorage'
import { Loader2 } from 'lucide-react'

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
        return (
            <div className="flex h-64 items-center justify-center bg-secondary rounded-3xl border border-emerald-800/50">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            </div>
        ) 
    }

    // 2. Unauthenticated users redirected to Login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // 3. Role-Based Access Control (RBAC) check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard/overview" replace />
    }

    // 4. Authorized -> Render requested child route
    return <Outlet />
}