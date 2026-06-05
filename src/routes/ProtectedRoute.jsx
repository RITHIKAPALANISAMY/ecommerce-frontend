import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  // ✅ WAIT UNTIL AUTH IS CHECKED
  if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
  );
}

  // ✅ NOT LOGGED IN
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ ROLE CHECK
  const userRoles = user.roles?.map((r) =>
    r.toUpperCase()
  );

  const isAllowed = allowedRoles?.some((role) =>
    userRoles?.includes(role)
  );

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}