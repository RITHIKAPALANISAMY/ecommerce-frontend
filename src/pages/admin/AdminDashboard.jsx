import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";
import { useProducts } from "../../context/ProductContext";

import "./AdminDashboard.css";

import Users from "./Users";
import Products from "./Products";
import AdminOrders from "./AdminOrders";
import Coupons from "./Coupons";
import Analytics from "./Analytics";
import Deals from "./Deals";
import Settings from "./Settings";
import Payments from "./Payments";
import Returns from "./Returns";
import Refunds from "./Refunds";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { orders = [] } = useOrders();
  const { products = [] } = useProducts();
  const users = JSON.parse(localStorage.getItem("admin_users")) || [];

  const totalOrders = orders.length;

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => {
      const amount = o.totalAmount || o.amount || o.total || 0;
      return sum + Number(amount);
    }, 0);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders].slice(-5).reverse();
  }, [orders]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const orderStatusCounts = useMemo(() => {
    const counts = { Completed: 0, Pending: 0, Cancelled: 0 };
    orders.forEach((o) => {
      const status = o.status?.toLowerCase() || "pending";
      if (status === "completed") counts.Completed++;
      else if (status === "cancelled") counts.Cancelled++;
      else counts.Pending++;
    });
    return counts;
  }, [orders]);

  const donutData = {
    labels: ["Completed", "Pending", "Cancelled"],
    datasets: [
      {
        data: [
          orderStatusCounts.Completed,
          orderStatusCounts.Pending,
          orderStatusCounts.Cancelled,
        ],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Sales",
        data: [2000, 3000, 2800, 4000, 5800],
        borderColor: "#931012",
        backgroundColor: "rgba(147,16,18,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="admin-header">
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
        <button className="logout-btn" onClick={handleLogout}>
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
          "payments",
          "returns",
          "refunds",
          "settings",
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

      {/* ================= OVERVIEW ================= */}
      {activeTab === "overview" && (
        <>
          {/* ===== KPI STATS ===== */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon users">👥</div>
              <div>
                <h2>{users.length}</h2>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon products">📊</div>
              <div>
                <h2>{products.length}</h2>
                <p>Total Products</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orders">📦</div>
              <div>
                <h2>{totalOrders}</h2>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon revenue">📈</div>
              <div>
                <h2>₹{totalRevenue}</h2>
                <p>Total Revenue</p>
              </div>
            </div>
          </div>

          {/* ===== ACTION BUTTONS ===== */}
          <div className="admin-actions">
            <button onClick={() => setActiveTab("payments")}>📄 Process Payment</button>
            <button onClick={() => setActiveTab("returns")}>🅿️ Manage Returns</button>
            <button onClick={() => setActiveTab("refunds")}>💰 Issue Refund</button>
          </div>

          {/* ===== CHARTS SIDE-BY-SIDE ===== */}
          <div className="overview-charts-row">
            <div className="chart-box">
              <h3>Orders Breakdown</h3>
              <div style={{ width: "220px", height: "220px", margin: "0 auto" }}>
                <Doughnut data={donutData} options={chartOptions} />
              </div>
            </div>
            <div className="chart-box">
              <h3>Sales Trend</h3>
              <div style={{ width: "100%", height: "250px" }}>
                <Line data={lineData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* ===== RECENT ORDERS ===== */}
          <div className="recent-orders">
            <div className="recent-orders-header">
              <h3>Recent Orders</h3>
              <button className="view-all" onClick={() => navigate("/admin/orders")}>
                View All
              </button>
            </div>
            <div className="recent-orders-table-wrapper">
              <table className="recent-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No recent orders
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="clickable-row"
                        onClick={() => navigate("/admin/orders")}
                      >
                        <td>{order.id}</td>
                        <td>{order.user?.name || "Customer"}</td>
                        <td>₹{order.totalAmount || order.amount || 0}</td>
                        <td>
                          <span className={`status ${order.status?.toLowerCase()}`}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ================= OTHER PAGES ================= */}
      {activeTab === "users" && <Users />}
      {activeTab === "products" && <Products />}
      {activeTab === "orders" && <AdminOrders />}
      {activeTab === "coupons" && <Coupons />}
      {activeTab === "deals" && <Deals />}
      {activeTab === "analytics" && <Analytics />}
      {activeTab === "payments" && <Payments />}
      {activeTab === "returns" && <Returns />}
      {activeTab === "refunds" && <Refunds />}
      {activeTab === "settings" && <Settings />}
    </>
  );
};

export default AdminDashboard;