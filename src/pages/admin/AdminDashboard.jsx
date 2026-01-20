import "./AdminDashboard.css";
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
} from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="admin-page">

      {/* Banner */}
      <div className="admin-banner">
        <h1>Admin Dashboard</h1>
        <p>Complete platform control and management</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <span className="active">Overview</span>
        <span>Products</span>
        <span>Orders</span>
        <span>Users</span>
        <span>Coupons</span>
        <span>Deals & Offers</span>
        <span>Analytics</span>
      </div>

      {/* Stats */}
      <div className="stats-row">

        <div className="stat-card">
          <div className="icon blue">
            <Users />
          </div>
          <div>
            <h2>150</h2>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon purple">
            <Package />
          </div>
          <div>
            <h2>90</h2>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon orange">
            <ShoppingBag />
          </div>
          <div>
            <h2>0</h2>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon green">
            <DollarSign />
          </div>
          <div>
            <h2>₹0</h2>
            <p>Total Revenue</p>
          </div>
        </div>

      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h3>Recent Orders</h3>
      </div>

    </div>
  );
};

export default AdminDashboard;
