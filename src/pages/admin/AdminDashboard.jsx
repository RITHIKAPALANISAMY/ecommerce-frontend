import { useMemo, useEffect, useState } from "react";
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

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

import { useOrders } from "../../context/OrderContext";
import { useProducts } from "../../context/ProductContext";
import { useUsers } from "../../context/UserContext";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const normalizeStatus = (status) =>
  String(status || "").trim().toUpperCase();

const statusBadge = (status) => {
  switch (normalizeStatus(status)) {
    case "PLACED":
      return "bg-yellow-100 text-yellow-700";
    case "SHIPPED":
      return "bg-blue-100 text-blue-700";
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const AdminDashboard = () => {
  const { orders = [], fetchAllOrders } = useOrders();
  const { products = [], fetchProducts } = useProducts();
  const { users = [], refreshUsers } = useUsers();

  const [previousPending, setPreviousPending] = useState(0);

  useEffect(() => {
    fetchAllOrders();
    fetchProducts();
    refreshUsers();

    const interval = setInterval(() => {
      fetchAllOrders();
      fetchProducts();
      refreshUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllOrders, fetchProducts, refreshUsers]);

  const pendingProducts = useMemo(() => {
    if (!products) return 0;

    return products.filter(
      (p) => normalizeStatus(p.status) === "PENDING"
    ).length;
  }, [products]);

  useEffect(() => {
    if (pendingProducts > previousPending) {
      toast.info("🔔 New product submitted for approval!");
    }
    setPreviousPending(pendingProducts);
  }, [pendingProducts]);

  const totalSellers = useMemo(
    () =>
      users.filter(
        (u) => u.role?.toLowerCase() === "seller"
      ).length,
    [users]
  );

  const totalRevenue = useMemo(() => {
    const total = orders.reduce((sum, o) => {
      if (normalizeStatus(o.status) !== "DELIVERED") return sum;
      return sum + Number(o.totalAmount || 0);
    }, 0);

    return Number(total.toFixed(2));
  }, [orders]);

  const last7DaysRevenue = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const dayTotal = orders.reduce((sum, o) => {
        const orderDate = new Date(
          o.createdAt || o.orderDate || o.date
        );

        if (
          normalizeStatus(o.status) === "DELIVERED" &&
          orderDate.toDateString() === d.toDateString()
        ) {
          return sum + Number(o.totalAmount || 0);
        }

        return sum;
      }, 0);

      days.push({
        date: d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        revenue: Number(dayTotal.toFixed(2)),
      });
    }

    return days;
  }, [orders]);

  const donutData = {
    labels: ["Placed", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [
          orders.filter((o) => normalizeStatus(o.status) === "PLACED").length,
          orders.filter((o) => normalizeStatus(o.status) === "SHIPPED").length,
          orders.filter((o) => normalizeStatus(o.status) === "DELIVERED").length,
          orders.filter((o) => normalizeStatus(o.status) === "CANCELLED").length,
        ],
        backgroundColor: [
          "#f59e0b",
          "#2563eb",
          "#16a34a",
          "#dc2626",
        ],
      },
    ],
  };

  const lineData = {
    labels: last7DaysRevenue.map((d) => d.date),
    datasets: [
      {
        label: "Revenue",
        data: last7DaysRevenue.map((d) => d.revenue),
        borderColor: "#931012",
        backgroundColor: "rgba(147,16,18,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const exportOverviewPDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(147, 16, 18);
    doc.rect(0, 0, 210, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("ShopVerse Admin Report", 14, 16);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      35
    );

    autoTable(doc, {
      startY: 45,
      head: [["Metric", "Value"]],
      body: [
        ["Total Users", users.length],
        ["Total Sellers", totalSellers],
        ["Total Products", products.length],
        ["Pending Products", pendingProducts],
        ["Total Orders", orders.length],
        ["Revenue", `₹${totalRevenue.toLocaleString("en-IN")}`],
      ],
    });

    doc.save("shopverse_admin_report.pdf");
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.orderDate || a.createdAt || 0);
    const dateB = new Date(b.orderDate || b.createdAt || 0);
    return dateB - dateA;
  });

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={exportOverviewPDF}
          className="px-4 py-2 bg-[#931012] text-white rounded-lg shadow"
        >
          Export Report PDF
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="👥" value={users.length} label="Users" />
        <StatCard icon="🏪" value={totalSellers} label="Sellers" />
        <StatCard icon="📦" value={products.length} label="Products" />
        <StatCard icon="⏳" value={pendingProducts} label="Pending Products" />
        <StatCard icon="🧾" value={orders.length} label="Orders" />
        <StatCard
          icon="₹"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          label="Revenue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <h3 className="font-semibold mb-4">
            Orders Breakdown
          </h3>

          <div className="w-[240px] h-[240px]">
            <Doughnut data={donutData} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold mb-4">
            Last 7 Days Revenue
          </h3>

          <div className="h-[260px]">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-10">
        <h3 className="font-semibold mb-4">
          Recent Orders
        </h3>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>

              {sortedOrders.slice(0, 5).map((o) => (

                <tr key={o.id || o._id} className="border-t">

                  <td className="p-3 font-medium">
                    {o.id}
                  </td>

                  <td className="p-3">
                    {o.buyerName || o.buyerEmail}
                  </td>

                  <td className="p-3 font-semibold">
                    ₹{o.totalAmount}
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        o.status
                      )}`}
                    >
                      {normalizeStatus(o.status)}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
};

const StatCard = ({ icon, value, label }) => (

  <div className="bg-white rounded-2xl shadow p-5 flex gap-4 items-center">

    <div className="bg-red-50 p-3 rounded-xl text-xl">
      {icon}
    </div>

    <div>
      <h2 className="text-xl font-bold">{value}</h2>
      <p className="text-sm text-gray-500">{label}</p>
    </div>

  </div>

);

export default AdminDashboard;