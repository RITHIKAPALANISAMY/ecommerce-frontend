import { useMemo } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { useOrders } from "../../context/OrderContext";
import { exportToCSV } from "../../utils/exportReports";
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

/* 🎨 Admin color palette */
const COLORS = {
  primary: "#931012",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  info: "#2563EB",
};

/* 🔧 Chart options */
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { boxWidth: 12, padding: 12 },
    },
  },
};

const doughnutOptions = {
  ...baseOptions,
  cutout: "65%",
};

export default function Analytics() {
  const { orders } = useOrders();

  /* ================= SALES TREND ================= */
  const salesByDate = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const date = new Date(o.createdAt).toLocaleDateString();
      map[date] = (map[date] || 0) + (o.amount || 0);
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
        backgroundColor: "rgba(147,16,18,0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  /* ================= ORDERS VS REVENUE ================= */
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.amount || 0),
    0
  );

  const ordersVsRevenue = {
    labels: ["Performance"],
    datasets: [
      {
        label: "Orders",
        data: [orders.length],
        backgroundColor: COLORS.warning,
      },
      {
        label: "Revenue (₹)",
        data: [totalRevenue],
        backgroundColor: COLORS.info,
      },
    ],
  };

  /* ================= ORDER STATUS ================= */
  const statusCounts = useMemo(() => {
    const counts = {
      PLACED: 0,
      APPROVED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    orders.forEach((o) => {
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
          statusCounts.APPROVED,
          statusCounts.DELIVERED,
          statusCounts.CANCELLED,
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
    orders.forEach((o) =>
      o.items?.forEach((i) => {
        map[i.title] =
          (map[i.title] || 0) +
          i.price * (i.quantity || 1);
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
        backgroundColor: COLORS.primary,
      },
    ],
  };

  /* ================= EXPORT ANALYTICS ================= */
  const exportAnalytics = () => {
    const report = [
      {
        TotalOrders: orders.length,
        TotalRevenue: totalRevenue,
        Placed: statusCounts.PLACED,
        Approved: statusCounts.APPROVED,
        Delivered: statusCounts.DELIVERED,
        Cancelled: statusCounts.CANCELLED,
      },
    ];

    exportToCSV("analytics_summary", report);
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Analytics Dashboard
        </h2>

        <button
          onClick={exportAnalytics}
          className="bg-[#931012] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
        >
          Export Analytics
        </button>
      </div>

      {/* TOP ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">📈 Sales Trend</h3>
          <div className="h-[260px]">
            <Line data={salesData} options={baseOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">
            📦 Orders vs Revenue
          </h3>
          <div className="h-[260px]">
            <Bar data={ordersVsRevenue} options={baseOptions} />
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">
            🏆 Top Selling Products
          </h3>
          <div className="h-[260px]">
            <Bar
              data={topProductsData}
              options={{ ...baseOptions, indexAxis: "y" }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">
            🟢 Order Status
          </h3>
          <div className="h-[260px] flex justify-center">
            <Doughnut
              data={orderStatusData}
              options={doughnutOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}