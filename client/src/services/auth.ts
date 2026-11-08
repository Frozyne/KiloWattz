import api from '../api/api'
import { type User } from '../storage/useAuthStorage'

export interface LoginResponse {
    accessToken?: string
    token?: string
    user: User
}

export interface LoginCredentials {
    email: string
    password: string
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
        const { data } = await api.post<{ data: LoginResponse }>('/auth/sign-in', credentials)
        
        // Normalize token key regardless of whether backend sends accessToken or token
        const token = data.data.accessToken || data.data.token || ''
        const user = data.data.user

        return { user, token }
    },

    logout: async (): Promise<any> => {
        const res = await api.post<void>('/auth/sign-out')
        return res
    }
}