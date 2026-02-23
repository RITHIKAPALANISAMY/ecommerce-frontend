import { useEffect, useState, useMemo } from "react";
import { getSellerOrders } from "../../api/orderApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { Calendar, Download } from "lucide-react";

const COLORS = ["#16a34a", "#2563eb", "#ef4444"];

export default function SellerAnalytics({ sellerEmail }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH SELLER ORDERS ================= */
  useEffect(() => {
    if (!sellerEmail) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getSellerOrders(sellerEmail);
        setOrders(res.data || []);
        setFilteredOrders(res.data || []);
      } catch (error) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sellerEmail]);

  /* ================= DATE FILTER ================= */
  const applyDateFilter = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select date range");
      return;
    }

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return (
        orderDate >= new Date(fromDate) &&
        orderDate <= new Date(toDate)
      );
    });

    setFilteredOrders(filtered);
    toast.success("Analytics updated");
  };

  /* ================= KPI CALCULATIONS ================= */
  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + (o.amount || 0),
    0
  );

  const totalOrders = filteredOrders.length;

  const delivered = filteredOrders.filter(
    (o) => o.status === "DELIVERED"
  ).length;

  const shipped = filteredOrders.filter(
    (o) => o.status === "SHIPPED"
  ).length;

  const cancelled = filteredOrders.filter(
    (o) => o.status === "CANCELLED"
  ).length;

  /* ================= MONTHLY GROUPING ================= */
  const monthlyData = useMemo(() => {
    const map = {};

    filteredOrders.forEach((order) => {
      const month = new Date(order.orderDate)
        .toLocaleString("default", { month: "short", year: "numeric" });

      if (!map[month]) {
        map[month] = { month, revenue: 0, orders: 0 };
      }

      map[month].revenue += order.amount || 0;
      map[month].orders += 1;
    });

    return Object.values(map);
  }, [filteredOrders]);

  const pieData = [
    { name: "Delivered", value: delivered },
    { name: "Shipped", value: shipped },
    { name: "Cancelled", value: cancelled },
  ];

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const header = "Month,Orders,Revenue\n";
    const rows = monthlyData
      .map((m) => `${m.month},${m.orders},${m.revenue}`)
      .join("\n");

    const blob = new Blob([header + rows], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "seller-analytics.csv";
    link.click();

    toast.success("CSV downloaded");
  };

  /* ================= EXPORT PDF ================= */
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Seller Analytics Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Seller: ${sellerEmail}`, 20, 35);
    doc.text(`Revenue: ₹${totalRevenue}`, 20, 45);
    doc.text(`Orders: ${totalOrders}`, 20, 55);

    doc.save("seller-analytics.pdf");
    toast.success("PDF downloaded");
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <p className="text-gray-500 animate-pulse">
          Loading analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seller Analytics</h2>

        <div className="flex gap-3">
          <button
            onClick={exportPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            PDF
          </button>

          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            CSV
          </button>
        </div>
      </div>

      {/* DATE FILTER */}
      <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl">
        <Calendar size={18} />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />
        <button
          onClick={applyDateFilter}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Apply
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <KPI title="Revenue" value={`₹${totalRevenue}`} />
        <KPI title="Orders" value={totalOrders} />
        <KPI title="Delivered" value={delivered} />
        <KPI title="Cancelled" value={cancelled} />
      </div>

      {/* BAR CHART */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#2563eb" maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>

      {/* PIE CHART */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={pieData} dataKey="value" outerRadius={100} label>
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function KPI({ title, value }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl text-center shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}