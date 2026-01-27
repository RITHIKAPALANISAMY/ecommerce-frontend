import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./AdminDashboard.css";

import Users from "./Users";
import Products from "./Products";
import Orders from "./Orders";
import Coupons from "./Coupons";
import Analytics from "./Analytics";
import Deals from "./Deals";
import Settings from "./Settings"; // ✅ REAL SETTINGS COMPONENT

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                 // 🔐 clear admin session
    navigate("/", { replace: true }); // 🏠 go to HOME
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <div
        className="admin-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1>Admin Dashboard</h1>
          <p>Complete platform control and management</p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "#e53935",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </div>

      {/* ================= TABS ================= */}
      <div className="admin-tabs">
        {[
          "overview",
          "users",
          "products",
          "orders",
          "coupons",
          "deals",
          "analytics",
          "settings", // ✅ SETTINGS TAB
        ].map((tab) => (
          <span
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "deals"
              ? "Deals & Offers"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </span>
        ))}
      </div>

      {/* ================= CONTENT ================= */}

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h2>150</h2>
              <p>Total Users</p>
            </div>
            <div className="stat-card">
              <h2>90</h2>
              <p>Total Products</p>
            </div>
            <div className="stat-card">
              <h2>0</h2>
              <p>Total Orders</p>
            </div>
            <div className="stat-card">
              <h2>₹0</h2>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="recent-orders">
            <h3>Recent Orders</h3>
          </div>
        </>
      )}

      {/* OTHER PAGES */}
      {activeTab === "users" && <Users />}
      {activeTab === "products" && <Products />}
      {activeTab === "orders" && <Orders />}
      {activeTab === "coupons" && <Coupons />}
      {activeTab === "deals" && <Deals />}
      {activeTab === "analytics" && <Analytics />}

      {/* ✅ SETTINGS – REAL COMPONENT */}
      {activeTab === "settings" && <Settings />}
    </>
  );
};

export default AdminDashboard;