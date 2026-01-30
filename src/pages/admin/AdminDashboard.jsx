import { useMemo } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import jsPDF from "jspdf";
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

import { useOrders } from "../../context/OrderContext";
import { useProducts } from "../../context/ProductContext";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const AdminDashboard = () => {
  const { orders = [] } = useOrders();
  const { products = [] } = useProducts();
  const users = JSON.parse(localStorage.getItem("admin_users")) || [];

  /* ================= TOTAL SELLERS (ADDED) ================= */
  const totalSellers = useMemo(() => {
    // 1️⃣ derive from products (real seller activity)
    const sellerIds = products
      .map((p) => p.sellerId)
      .filter(Boolean);

    const uniqueSellers = new Set(sellerIds);

    if (uniqueSellers.size > 0) {
      return uniqueSellers.size;
    }

    // 2️⃣ fallback: users with Seller role
    return users.filter((u) => u.role === "Seller").length;
  }, [products, users]);
  /* ========================================================= */

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.amount || 0), 0),
    [orders]
  );

  const orderStatusCounts = useMemo(() => {
    const counts = {
      PLACED: 0,
      APPROVED: 0,
      CANCELLED: 0,
      DELIVERED: 0,
    };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  /* ================= EXPORT PDF (EXISTING) ================= */
  const exportPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Admin Dashboard Report", 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, y);
    y += 10;

    doc.setFontSize(14);
    doc.text("Key Metrics", 14, y);
    y += 8;

    doc.setFontSize(11);
    doc.text(`Total Users: ${users.length}`, 14, y);
    y += 6;
    doc.text(`Total Sellers: ${totalSellers}`, 14, y);
    y += 6;
    doc.text(`Total Products: ${products.length}`, 14, y);
    y += 6;
    doc.text(`Total Orders: ${orders.length}`, 14, y);
    y += 6;
    doc.text(`Total Revenue: ₹${totalRevenue}`, 14, y);
    y += 10;

    doc.setFontSize(14);
    doc.text("Order Status Breakdown", 14, y);
    y += 8;

    Object.entries(orderStatusCounts).forEach(([status, count]) => {
      doc.setFontSize(11);
      doc.text(`${status}: ${count}`, 14, y);
      y += 6;
    });

    doc.save("admin-dashboard-report.pdf");
  };
  /* ========================================================= */

  const donutData = {
    labels: Object.keys(orderStatusCounts),
    datasets: [
      {
        data: Object.values(orderStatusCounts),
        backgroundColor: ["#f59e0b", "#16a34a", "#dc2626", "#2563eb"],
      },
    ],
  };

  const lineData = {
    labels: ["Sales"],
    datasets: [
      {
        label: "Revenue",
        data: [totalRevenue],
        borderColor: "#931012",
        backgroundColor: "rgba(147,16,18,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <>
      {/* EXPORT BUTTON */}
      <div className="flex justify-end mb-5">
        <button
          onClick={exportPDF}
          className="bg-[#931012] text-white px-4 py-2 rounded-lg font-medium hover:bg-red-800 transition"
        >
          Export PDF
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          ["👥", users.length, "Total Users"],
          ["🏪", totalSellers, "Total Sellers"], // ✅ ADDED
          ["📦", products.length, "Total Products"],
          ["🧾", orders.length, "Total Orders"],
          ["₹", totalRevenue, "Total Revenue"],
        ].map(([icon, value, label], i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-5 flex items-center gap-4"
          >
            <div className="bg-red-50 p-3 rounded-xl text-xl">
              {icon}
            </div>
            <div>
              <h2 className="text-xl font-bold">{value}</h2>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold mb-4">Orders Breakdown</h3>
          <div className="h-[260px] flex justify-center">
            <Doughnut data={donutData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold mb-4">Sales Trend</h3>
          <div className="h-[260px]">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;