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

  /* ================= KPI DATA ================= */
  const totalOrders = orders.length;

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
      .slice(0, 5);
  }, [orders]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  /* ================= ORDER STATUS COUNTS ================= */
  const orderStatusCounts = useMemo(() => {
    const counts = {
      PLACED: 0,
      Approved: 0,
      Cancelled: 0,
      Delivered: 0,
    };

    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });

    return counts;
  }, [orders]);

  /* ================= MONTHLY SALES ================= */
  const monthlySales = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const key = new Date(o.createdAt).toLocaleString(
        "default",
        { month: "short", year: "numeric" }
      );

      map[key] = (map[key] || 0) + (o.amount || 0);
    });
    return map;
  }, [orders]);

  /* ================= CHART DATA ================= */
  const donutData = {
    labels: Object.keys(orderStatusCounts),
    datasets: [
      {
        data: Object.values(orderStatusCounts),
        backgroundColor: [
          "#ff9800",
          "#4caf50",
          "#f44336",
          "#2196f3",
        ],
      },
    ],
  };

  const lineData = {
    labels: Object.keys(monthlySales),
    datasets: [
      {
        label: "Sales",
        data: Object.values(monthlySales),
        borderColor: "#931012",
        backgroundColor: "rgba(147,16,18,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Complete platform control and management</p>
        </div>
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
              : tab.charAt(0).toUpperCase() +
                tab.slice(1)}
          </span>
        ))}
      </div>

      {/* ================= OVERVIEW ================= */}
      {activeTab === "overview" && (
        <>
          {/* KPI */}
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
                <h2>₹{totalRevenue.toLocaleString()}</h2>
                <p>Total Revenue</p>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="admin-actions">
            <button onClick={() => setActiveTab("payments")}>
              📄 Process Payment
            </button>
            <button onClick={() => setActiveTab("returns")}>
              🅿️ Manage Returns
            </button>
            <button onClick={() => setActiveTab("refunds")}>
              💰 Issue Refund
            </button>
          </div>

          {/* CHARTS */}
          <div className="overview-charts-row">
            <div className="chart-box">
              <h3>Orders Breakdown</h3>
              <div
                style={{
                  width: "220px",
                  height: "220px",
                  margin: "0 auto",
                }}
              >
                <Doughnut
                  data={donutData}
                  options={chartOptions}
                />
              </div>
            </div>

            <div className="chart-box">
              <h3>Sales Trend</h3>
              <div
                style={{ width: "100%", height: "250px" }}
              >
                <Line
                  data={lineData}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>

          {/* RECENT ORDERS */}
          {/* ===== RECENT ORDERS ===== */}
<div className="recent-orders">
  <div className="recent-orders-header">
    <h3>Recent Orders</h3>
    <button
      className="view-all"
      onClick={() => setActiveTab("orders")}
    >
      View All
    </button>
  </div>

  <table className="recent-orders-table">
    <thead>
      <tr>
        <th style={{ width: "30%" }}>Order ID</th>
        <th style={{ width: "25%" }}>User</th>
        <th style={{ width: "20%" }}>Amount</th>
        <th style={{ width: "25%" }}>Status</th>
      </tr>
    </thead>

    <tbody>
      {recentOrders.length === 0 ? (
        <tr>
          <td colSpan="4" className="empty-cell">
            No recent orders
          </td>
        </tr>
      ) : (
        recentOrders.map((o) => (
          <tr
            key={o.id}
            className="recent-row"
            onClick={() => setActiveTab("orders")}
          >
            <td className="mono">#{o.id}</td>
            <td>{o.buyerName}</td>
            <td>₹{o.amount}</td>
            <td>
              <span className={`status ${o.status.toLowerCase()}`}>
                {o.status}
              </span>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

        </>
      )}

      {/* ================= OTHER TABS ================= */}
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
