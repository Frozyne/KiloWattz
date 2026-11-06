import axios from "axios";
import { useAuthStore } from "@/storage/useAuthStorage";

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

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default api;
