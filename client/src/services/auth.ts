import api from './api'
import { type User } from '../storage/useAuthStorage'

export interface LoginResponse {
    token: string
    user: User
}

export interface LoginCredentials {
    email: string
    password: string
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const { data } = await api.post<{ data: LoginResponse }>('/auth/sign-in', credentials)
        return data.data
    },
}