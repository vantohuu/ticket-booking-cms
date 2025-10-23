import axios from "axios"
import { getAccessToken, clearTokens } from "../utils/tokenUtils"
import { refreshAccessToken } from "./authService"
import { jwtDecode } from "jwt-decode"

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/"
const API_TIMEOUT = process.env.REACT_APP_API_TIMEOUT || 10000

const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    try {
      const decoded = jwtDecode(token)
      const roles = decoded.scope || ""

      // Block CUSTOMER role
      if (roles.includes("ROLE_CUSTOMER")) {
        clearTokens()
        window.location.href = "/unauthorized"
        return Promise.reject("Khách hàng không có quyền truy cập")
      }

      // Allow MANAGER and STAFF
      if (!roles.includes("ROLE_MANAGER") && !roles.includes("ROLE_STAFF")) {
        clearTokens()
        window.location.href = "/login"
        return Promise.reject("Không có quyền truy cập")
      }

      config.headers.Authorization = `Bearer ${token}`
    } catch (err) {
      console.error("JWT decode error:", err)
      clearTokens()
      window.location.href = "/login"
      return Promise.reject(err)
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newAccessToken = await refreshAccessToken()
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      }
    }
    return Promise.reject(error)
  },
)

api.interceptors.request.use(
  (config) => {
    console.log("🚀 Request:", {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
      data: config.data,
    })
    return config
  },
  (error) => {
    console.error("❌ Request Error:", error)
    return Promise.reject(error)
  },
)

// Debug response
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    })
    return response
  },
  (error) => {
    console.error("❌ Response Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    })
    return Promise.reject(error)
  },
)

export default api
