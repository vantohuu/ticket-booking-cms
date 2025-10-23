import { Navigate, Outlet } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const ManagerRoute = () => {
  const token = localStorage.getItem("access_token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  try {
    const decoded = jwtDecode(token)
    const roles = decoded?.scope || ""

    // Only allow MANAGER role
    if (roles.includes("ROLE_MANAGER")) {
      return <Outlet />
    }

    // Redirect to home if not manager
    return <Navigate to="/" replace />
  } catch (error) {
    console.error("Token decode error:", error)
    return <Navigate to="/login" replace />
  }
}

export default ManagerRoute
