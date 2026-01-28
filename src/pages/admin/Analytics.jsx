import "./Analytics.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { useOrders } from "../../context/OrderContext";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const { orders } = useOrders();

  /* ================= DATE FILTER ================= */
  const [filter, setFilter] = useState("month"); // today | week | month

  const now = new Date();

  const filteredOrders = orders.filter((o) => {
    if (!o.createdAt) return false;
    const orderDate = new Date(o.createdAt);

    if (filter === "today") {
      return orderDate.toDateString() === now.toDateString();
    }

    if (filter === "week") {
      const diff = (now - orderDate) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }

    return true; // month (default)
  });

  /* ================= SALES TREND ================= */
  const salesByDate = {};

  filteredOrders.forEach((o) => {
    const date = new Date(o.createdAt).toLocaleDateString();
    salesByDate[date] = (salesByDate[date] || 0) + (o.totalAmount || 0);
  });

  const salesTrendData = {
    labels: Object.keys(salesByDate),
    datasets: [
      {
        label: "Sales Revenue",
        data: Object.values(salesByDate),
        borderColor: "#e91e63",
        backgroundColor: "rgba(233,30,99,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  /* ================= ORDER STATUS ================= */
  const statusCount = {
    Pending: 0,
    Approved: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  filteredOrders.forEach((o) => {
    if (statusCount[o.status] !== undefined) {
      statusCount[o.status]++;
    }
  });

  const statusData = {
    labels: Object.keys(statusCount),
    datasets: [
      {
        data: Object.values(statusCount),
        backgroundColor: [
          "#ffb74d",
          "#81c784",
          "#64b5f6",
          "#e57373",
        ],
        cutout: "70%",
      },
    ],
  };

  const donutOptions = {
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      duration: 1200,
      easing: "easeInOutCubic",
    },
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  /* ================= ORDERS vs REVENUE ================= */
  const barOptions = {
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  const barData = {
    labels: ["Orders", "Revenue"],
    datasets: [
      {
        label: "Performance",
        data: [
          filteredOrders.length,
          filteredOrders.reduce((s, o) => s + (o.totalAmount || 0), 0),
        ],
        backgroundColor: ["#6c63ff", "#00c853"],
        borderRadius: 10,
      },
    ],
  };

  /* ================= SELLER WISE ================= */
  const sellerMap = {};

  filteredOrders.forEach((order) => {
    order.items?.forEach((item) => {
      const seller = item.sellerName || "Unknown Seller";

      if (!sellerMap[seller]) {
        sellerMap[seller] = { revenue: 0, orders: 0 };
      }

      sellerMap[seller].orders += 1;
      sellerMap[seller].revenue +=
        item.price && item.quantity
          ? item.price * item.quantity
          : order.totalAmount / order.items.length;
    });
  });

  const sellerLabels = Object.keys(sellerMap);

  const sellerRevenueData = {
    labels: sellerLabels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: sellerLabels.map((s) => sellerMap[s].revenue),
        backgroundColor: "#6c63ff",
        borderRadius: 10,
      },
    ],
  };

  const sellerOrdersData = {
    labels: sellerLabels,
    datasets: [
      {
        label: "Orders",
        data: sellerLabels.map((s) => sellerMap[s].orders),
        backgroundColor: "#00c853",
        borderRadius: 10,
      },
    ],
  };

  const totalRevenue = filteredOrders.reduce(
    (s, o) => s + (o.totalAmount || 0),
    0
  );

  /* ================= UI ================= */
  return (
    <div className="analytics-page">

      {/* ===== SALES TREND + FILTER ===== */}
      <div className="analytics-card small">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>📈 Sales Trend</h3>

          <div className="date-filter">
            {["today", "week", "month"].map((f) => (
              <button
                key={f}
                className={filter === f ? "active" : ""}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="chart-sm">
          <Line data={salesTrendData} options={lineOptions} />
        </div>
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="analytics-grid">

        <div className="analytics-card">
          <h3>📊 Orders vs Revenue</h3>
          <div className="chart-md">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="analytics-card">
          <h3>🟢 Order Status</h3>
          <div className="chart-md donut">
            <Doughnut data={statusData} options={donutOptions} />
            <div className="donut-center">
              <h2>{filteredOrders.length}</h2>
              <p>Total Orders</p>
            </div>
          </div>
        </div>

        <div className="analytics-card stats">
          <h3>📦 Summary</h3>
          <div className="stat-box">
            <p>Total Orders</p>
            <h2>{filteredOrders.length}</h2>
          </div>
          <div className="stat-box">
            <p>Total Revenue</p>
            <h2>₹{totalRevenue}</h2>
          </div>
        </div>

        <div className="analytics-card">
          <h3>🏪 Seller-wise Revenue</h3>
          <div className="chart-md">
            <Bar data={sellerRevenueData} options={barOptions} />
          </div>
        </div>

        <div className="analytics-card">
          <h3>📦 Seller-wise Orders</h3>
          <div className="chart-md">
            <Bar data={sellerOrdersData} options={barOptions} />
          </div>
        </div>

      </div>
    </div>
  );
}