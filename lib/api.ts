import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to automatically inject active JWT token
api.interceptors.request.use(
  (config: any) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle expired sessions and clear storage on 401s
api.interceptors.response.use(
  (response: any) => {
    return response
  },
  (error: any) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // Suppress circular redirection if we are already on login page
        if (!window.location.pathname.startsWith("/auth/login")) {
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("user_role")
          localStorage.removeItem("user_name")
          window.location.href = "/auth/login?expired=true"
        }
      }
    }
    return Promise.reject(error)
  }
)
