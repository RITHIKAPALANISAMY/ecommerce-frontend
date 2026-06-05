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

const COLORS = {
  primary: "#931012",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  info: "#2563EB",
};

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
  },
};

const normalizeStatus = (status) =>
  String(status || "").toUpperCase();

export default function Analytics() {
  const { orders = [] } = useOrders();

  /* ================= SAFE DATE ================= */
  const getOrderDate = (o) =>
    new Date(o.createdAt || o.orderDate || o.date);

  /* ================= SALES TREND (LAST 7 DAYS) ================= */
  const salesByDate = useMemo(() => {
    const map = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toDateString();

      map[key] = 0;
    }

    orders.forEach((o) => {
      const dateKey = getOrderDate(o).toDateString();

      if (normalizeStatus(o.status) === "DELIVERED") {
        if (map[dateKey] !== undefined) {
          map[dateKey] += Number(o.totalAmount || 0);
        }
      }
    });

    return {
      labels: Object.keys(map).map((d) =>
        new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        })
      ),
      values: Object.values(map),
    };
  }, [orders]);

  const salesData = {
    labels: salesByDate.labels,
    datasets: [
      {
        label: "Sales (₹)",
        data: salesByDate.values,
        borderColor: COLORS.primary,
        backgroundColor: "rgba(147,16,18,0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  /* ================= TOTALS ================= */
  const totalRevenue = useMemo(
    () =>
      orders.reduce(
        (sum, o) =>
          normalizeStatus(o.status) === "DELIVERED"
            ? sum + Number(o.totalAmount || 0)
            : sum,
        0
      ),
    [orders]
  );

  /* ================= ORDERS vs REVENUE ================= */
  const ordersVsRevenue = {
    labels: ["Performance"],
    datasets: [
      {
        label: "Orders",
        data: [orders.length],
        backgroundColor: COLORS.warning,
        yAxisID: "yOrders",
      },
      {
        label: "Revenue (₹)",
        data: [totalRevenue],
        backgroundColor: COLORS.info,
        yAxisID: "yRevenue",
      },
    ],
  };

  const ordersVsRevenueOptions = {
    ...baseOptions,
    scales: {
      yOrders: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        title: { display: true, text: "Orders" },
      },
      yRevenue: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        title: { display: true, text: "Revenue (₹)" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  /* ================= STATUS COUNT ================= */
  const statusCounts = useMemo(() => {
    const counts = {
      PLACED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    orders.forEach((o) => {
      const s = normalizeStatus(o.status);
      if (counts[s] !== undefined) counts[s]++;
    });

    return counts;
  }, [orders]);

  const orderStatusData = {
    labels: ["Placed", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          COLORS.warning,
          COLORS.info,
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
          Number(i.price || 0) *
            Number(i.quantity || 1);
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

  /* ================= EXPORT ================= */
  const exportAnalytics = () => {
    exportToCSV("analytics_summary", [
      {
        TotalOrders: orders.length,
        TotalRevenue: totalRevenue,
        ...statusCounts,
      },
    ]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Analytics Dashboard
        </h2>

        <button
          onClick={exportAnalytics}
          className="bg-[#931012] text-white px-4 py-2 rounded-lg text-sm"
        >
          Export Analytics
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">
            📈 Sales Trend (7 Days)
          </h3>
          <div className="h-[260px]">
            <Line data={salesData} options={baseOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">
            📦 Orders vs Revenue
          </h3>
          <div className="h-[260px]">
            <Bar
              data={ordersVsRevenue}
              options={ordersVsRevenueOptions}
            />
          </div>
        </div>
      </div>

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
              options={{ ...baseOptions, cutout: "65%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}