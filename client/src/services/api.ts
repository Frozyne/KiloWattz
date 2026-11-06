
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "Backend URL is missing. Check your frontend .env file."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ""),
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
