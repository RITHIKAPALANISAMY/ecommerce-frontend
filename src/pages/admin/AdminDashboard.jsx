import { useState } from "react";
import "./AdminDashboard.css";
import Users from "./Users";
import Products from "./Products";
import Orders from "./Orders";
import Coupons from "./Coupons";
import Analytics from "./Analytics";
import Deals from "./Deals";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      {/* HEADER */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Complete platform control and management</p>
      </div>

      {/* TABS */}
      <div className="admin-tabs">
        {[
          "overview",
          "users",
          "products",
          "orders",
          "coupons",
          "deals",
          "analytics",
        ].map(tab => (
          <span
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "deals" ? "Deals & Offers" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </span>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === "overview" && (
        <>
          <div className="stats-grid">
            <div className="stat-card"><h2>150</h2><p>Total Users</p></div>
            <div className="stat-card"><h2>90</h2><p>Total Products</p></div>
            <div className="stat-card"><h2>0</h2><p>Total Orders</p></div>
            <div className="stat-card"><h2>₹0</h2><p>Total Revenue</p></div>
          </div>

          <div className="recent-orders">
            <h3>Recent Orders</h3>
          </div>
        </>
      )}

      {activeTab === "users" && <Users />}
      {activeTab === "products" && <Products />}
      {activeTab === "orders" && <Orders />}
      {activeTab === "coupons" && <Coupons />}
      {activeTab === "deals" && <Deals />}
      {activeTab === "analytics" && <Analytics />}
    </>
  );
};

export default AdminDashboard;
