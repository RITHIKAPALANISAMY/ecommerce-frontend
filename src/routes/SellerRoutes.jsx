import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.roles?.includes("ROLE_SELLER")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
