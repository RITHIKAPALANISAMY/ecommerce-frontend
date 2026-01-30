import React, { useMemo } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import "./analytics.css";
import { useOrders } from "../../context/OrderContext";
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

/* 🎨 Color palette */
const COLORS = {
  primary: "#4F46E5",
  secondary: "#06B6D4",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  purple: "#7C3AED",
  slate: "#64748B",
  pink: "#EC4899",
};

/* 🔧 Common chart options */
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { boxWidth: 12, padding: 10 },
    },
  },
};

const doughnutOptions = {
  ...commonOptions,
  cutout: "65%",
};

const Analytics = () => {
  const { orders } = useOrders();

  /* ================= SALES TREND ================= */
  const salesByDate = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      const date = new Date(o.createdAt).toLocaleDateString();
      map[date] = (map[date] || 0) + o.amount;
    });
    return map;
  }, [orders]);

  const salesData = {
    labels: Object.keys(salesByDate),
    datasets: [
      {
        label: "Sales (₹)",
        data: Object.values(salesByDate),
        borderColor: COLORS.primary,
        backgroundColor: "rgba(79,70,229,0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  /* ================= ORDERS VS REVENUE ================= */
  const ordersVsRevenueData = {
    labels: ["Performance"],
    datasets: [
      {
        label: "Orders",
        data: [orders.length],
        backgroundColor: COLORS.warning,
      },
      {
        label: "Revenue",
        data: [
          orders.reduce((sum, o) => sum + o.amount, 0),
        ],
        backgroundColor: COLORS.purple,
      },
    ],
  };

  /* ================= ORDER STATUS ================= */
  const statusCounts = useMemo(() => {
    const counts = { PLACED: 0, Approved: 0, Delivered: 0, Cancelled: 0 };
    orders.forEach(o => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const orderStatusData = {
    labels: ["Placed", "Approved", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [
          statusCounts.PLACED,
          statusCounts.Approved,
          statusCounts.Delivered,
          statusCounts.Cancelled,
        ],
        backgroundColor: [
          COLORS.warning,
          COLORS.primary,
          COLORS.success,
          COLORS.danger,
        ],
      },
    ],
  };

  /* ================= TOP PRODUCTS ================= */
  const productSales = useMemo(() => {
    const map = {};
    orders.forEach(o =>
      o.items.forEach(i => {
        map[i.title] =
          (map[i.title] || 0) + i.price * (i.quantity || 1);
      })
    );
    return map;
  }, [orders]);

  const topProductsData = {
    labels: Object.keys(productSales),
    datasets: [
      {
        label: "Revenue (₹)",
        data: Object.values(productSales),
        backgroundColor: [
          COLORS.primary,
          COLORS.secondary,
          COLORS.success,
          COLORS.warning,
          COLORS.pink,
        ],
      },
    ],
  };

  return (
    <div className="analytics">
      <h1>Analytics Dashboard</h1>

      {/* SALES TREND */}
      <div className="section chart-container">
        <h2>📈 Sales Trend</h2>
        <div className="chart-box large">
          <Line data={salesData} options={commonOptions} />
        </div>
      </div>

      {/* ORDERS VS REVENUE */}
      <div className="section chart-container">
        <h2>📦 Orders vs ₹ Revenue</h2>
        <div className="chart-box large">
          <Bar data={ordersVsRevenueData} options={commonOptions} />
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <div className="section chart-container">
        <h2>Top Selling Products</h2>
        <div className="chart-box large">
          <Bar
            data={topProductsData}
            options={{ ...commonOptions, indexAxis: "y" }}
          />
        </div>
      </div>

      {/* ORDER STATUS */}
      <div className="section chart-container">
        <h2>🟢 Order Status</h2>
        <div className="chart-box small">
          <Doughnut data={orderStatusData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
