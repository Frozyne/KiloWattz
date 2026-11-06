import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type UserRole = 'Admin'

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    
    // Actions
    setAuth: (user: User, token: string) => void
    logout: () => void
    hasRole: (roles: UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                }),

            hasRole: (allowedRoles) => {
                const currentUser = get().user
                if (!currentUser) return false
                return allowedRoles.includes(currentUser.role)
            },
        }),
        {
            name: 'kilowattz-auth-storage', // localStorage key
            storage: createJSONStorage(() => localStorage),
        }
    )
)