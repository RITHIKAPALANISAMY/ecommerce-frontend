import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminNavbar from "../components/admin/AdminNavbar";

const AdminRoutes = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="admin-app">
      <AdminNavbar />

      {/* SAME CENTER ALIGNMENT AS BUYER & SELLER */}
      <div className="admin-page">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminRoutes;
