import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/storage/useAuthStorage";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';

if (!API_BASE_URL) {
  throw new Error(
    "Backend URL is missing. Check your frontend .env file."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false
let failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error)
        } else if (token) {
            promise.resolve(token)
        }
    })
    failedQueue = []
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config as CustomAxiosRequestConfig

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      // If the /auth/refresh request itself returns a 401, force full logout
      if (originalRequest.url?.includes('/auth/refresh')) {
          useAuthStore.getState().logout()
          return Promise.reject(error)
      }

      // If a refresh is already in progress, queue this request until it finishes
      if (isRefreshing) {
          return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
          })
          .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
          // Call backend refresh endpoint (cookie is automatically sent via withCredentials)
          const { data } = await api.post('/auth/refresh')
          const { accessToken, user } = data.data

          // Update Zustand store & localStorage
          useAuthStore.getState().setAuth(user, accessToken)

          // Update header on the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`

          // Resolve all queued requests with the new token
          processQueue(null, accessToken)

          // Retry original request
          return api(originalRequest)
      } catch (refreshError) {
          // Refresh failed (e.g., session revoked or expired cookie) -> clear queue & force logout
          processQueue(refreshError, null)
          useAuthStore.getState().logout()
          return Promise.reject(refreshError)
      } finally {
          isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api;
