import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerRoutes() {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not a seller
  if (user.role !== "seller") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Seller is allowed
  return <Outlet />;
}
