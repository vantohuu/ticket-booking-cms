import { Navigate, Outlet } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const PrivateRoute = () => {
  const token = localStorage.getItem("access_token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  try {
    const decoded = jwtDecode(token)
    const roles = decoded?.scope || ""

    // Block CUSTOMER role
    if (roles.includes("ROLE_CUSTOMER")) {
      return <Navigate to="/unauthorized" replace />
    }

    if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_MANAGER") || roles.includes("ROLE_STAFF")) {
      return <Outlet />
    }

    // No valid role found
    return <Navigate to="/login" replace />
  } catch (error) {
    console.error("Token decode error:", error)
    return <Navigate to="/login" replace />
  }
}

export default PrivateRoute
