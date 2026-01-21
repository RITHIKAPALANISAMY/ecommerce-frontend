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

  /* ================= SALES TREND ================= */
  const salesByDate = {};
  orders.forEach((o) => {
    const date = o.createdAt
      ? new Date(o.createdAt).toLocaleDateString()
      : "Unknown";
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

  /* ================= ORDER STATUS ================= */
  const statusCount = {
    Pending: 0,
    Approved: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  orders.forEach((o) => {
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

  /* ================= ORDERS vs REVENUE ================= */
  const barData = {
    labels: ["Orders", "Revenue"],
    datasets: [
      {
        label: "Performance",
        data: [
          orders.length,
          orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
        ],
        backgroundColor: ["#6c63ff", "#00c853"],
        borderRadius: 10,
      },
    ],
  };

  /* ================= SELLER WISE ANALYTICS ================= */
  const sellerMap = {};

  orders.forEach((order) => {
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

  const totalRevenue = orders.reduce(
    (s, o) => s + (o.totalAmount || 0),
    0
  );

  /* ================= UI ================= */
  return (
    <div className="analytics-page">

      {/* SALES TREND */}
      <div className="analytics-card small">
        <h3>📈 Sales Trend</h3>
        <div className="chart-sm">
          <Line data={salesTrendData} />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="analytics-grid">

        {/* ORDERS vs REVENUE */}
        <div className="analytics-card">
          <h3>📊 Orders vs Revenue</h3>
          <div className="chart-md">
            <Bar data={barData} />
          </div>
        </div>
         
        {/* ORDER STATUS */}
        <div className="analytics-card">
          <h3>🟢 Order Status</h3>
          <div className="chart-md donut">
            <Doughnut data={statusData} />
            <div className="donut-center">
              <h2>{orders.length}</h2>
              <p>Total Orders</p>
            </div>
          </div>
        </div>
        

        {/* SUMMARY */}
        <div className="analytics-card stats">
          <h3>📦 Summary</h3>
          <div className="stat-box">
            <p>Total Orders</p>
            <h2>{orders.length}</h2>
          </div>
          <div className="stat-box">
            <p>Total Revenue</p>
            <h2>₹{totalRevenue}</h2>
          </div>
        </div>
        

        {/* SELLER WISE REVENUE */}
        <div className="analytics-card">
          <h3>🏪 Seller-wise Revenue</h3>
          <div className="chart-md">
            <Bar data={sellerRevenueData} />
          </div>
        </div>

        {/* SELLER WISE ORDERS */}
        <div className="analytics-card">
          <h3>📦 Seller-wise Orders</h3>
          <div className="chart-md">
            <Bar data={sellerOrdersData} />
          </div>
        </div>

      </div>
    </div>
  );
}
