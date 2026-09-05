import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decode = jwtDecode(token);
      const isExpired = decode.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
      }
    } catch (error) {
      console.error("Invalid token format:", error);
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } else {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

