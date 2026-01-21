import { useState } from "react";
import "./AdminDashboard.css";
import Products from "./Products";
import Orders from "./Orders";
import Coupons from "./Coupons";
import Analytics from "./Analytics";
import Deals from "./Deals";
import Users from "./Users";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="admin-container">

      {/* HEADER */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Complete platform control and management</p>
      </div>

      {/* TABS */}
      <div className="admin-tabs">
        <span
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </span>

        <span
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </span>

       <span
  className={activeTab === "products" ? "active" : ""}
  onClick={() => setActiveTab("products")}
>
  Products
</span>

        <span
  className={activeTab === "orders" ? "active" : ""}
  onClick={() => setActiveTab("orders")}
>
  Orders
</span>

        <span
  className={activeTab === "coupons" ? "active" : ""}
  onClick={() => setActiveTab("coupons")}
>
  Coupons
</span>

       <span
  className={activeTab === "deals" ? "active" : ""}
  onClick={() => setActiveTab("deals")}
>
  Deals & Offers
</span>


        <span
  className={activeTab === "analytics" ? "active" : ""}
  onClick={() => setActiveTab("analytics")}
>
  Analytics
</span>

      </div>
      

      {/* CONTENT SWITCH */}
      {activeTab === "overview" && (
        <>
          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="icon blue">👤</div>
              <div>
                <h2>150</h2>
                <p>Total Users</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="icon purple">📦</div>
              <div>
                <h2>90</h2>
                <p>Total Products</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="icon orange">🛒</div>
              <div>
                <h2>0</h2>
                <p>Total Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="icon green">₹</div>
              <div>
                <h2>₹0</h2>
                <p>Total Revenue</p>
              </div>
            </div>
          </div>

          <div className="recent-orders">
            <h3>Recent Orders</h3>
            <div className="empty-box"></div>
          </div>
        </>
      )}

      {activeTab === "users" && <Users />}
      {activeTab === "products" && <Products />}
      {activeTab === "orders" && <Orders />}
{activeTab === "coupons" && <Coupons />}

{activeTab === "deals" && <Deals />}

      {activeTab === "analytics" && <Analytics />}

    </div>
  );
};

export default AdminDashboard;
