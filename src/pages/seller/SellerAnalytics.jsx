import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { getSellerOrders } from "../../api/orderApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SellerAnalytics() {
  const { user } = useAuth();
  const sellerEmail = user?.email?.toLowerCase();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState("LAST_30");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!sellerEmail) return;

    const fetch = async () => {
      const res = await getSellerOrders(sellerEmail);
      setOrders(res.data || []);
      setFilteredOrders(res.data || []);
      setLoading(false);
    };

    fetch();
  }, [sellerEmail]);

  /* ================= FILTER ENGINE ================= */
  useEffect(() => {
    let data = [...orders];
    const now = new Date();

    if (filterType === "LAST_7") {
      const past = new Date();
      past.setDate(now.getDate() - 7);
      data = data.filter(o => new Date(o.orderDate) >= past);
    }

    if (filterType === "LAST_30") {
      const past = new Date();
      past.setDate(now.getDate() - 30);
      data = data.filter(o => new Date(o.orderDate) >= past);
    }

    if (filterType === "LAST_90") {
      const past = new Date();
      past.setDate(now.getDate() - 90);
      data = data.filter(o => new Date(o.orderDate) >= past);
    }

    if (filterType === "CUSTOM_DATE" && fromDate && toDate) {
      data = data.filter(o => {
        const d = new Date(o.orderDate);
        return d >= new Date(fromDate) && d <= new Date(toDate);
      });
    }

    if (filterType === "MONTH_RANGE" && fromMonth && toMonth) {
      const start = new Date(fromMonth + "-01");
      const end = new Date(toMonth + "-31");
      data = data.filter(o => {
        const d = new Date(o.orderDate);
        return d >= start && d <= end;
      });
    }

    if (filterType === "YEAR_RANGE" && fromYear && toYear) {
      data = data.filter(o => {
        const year = new Date(o.orderDate).getFullYear();
        return year >= fromYear && year <= toYear;
      });
    }

    setFilteredOrders(data);
  }, [
    orders,
    filterType,
    fromDate,
    toDate,
    fromMonth,
    toMonth,
    fromYear,
    toYear,
  ]);

  /* ================= METRICS ================= */
  const delivered = filteredOrders.filter(o => o.status === "DELIVERED");
  const cancelled = filteredOrders.filter(o => o.status === "CANCELLED");
  const shipped = filteredOrders.filter(o => o.status === "SHIPPED");

  const totalRevenue = delivered.reduce((sum, order) => {
    const sellerItems = order.items?.filter(
      i => i.sellerEmail?.toLowerCase() === sellerEmail
    );

    const revenue = sellerItems?.reduce(
      (s, i) => s + i.price * i.quantity,
      0
    );

    return sum + (revenue || 0);
  }, 0);

  const avgOrderValue = delivered.length
    ? (totalRevenue / delivered.length).toFixed(2)
    : 0;

  const deliveryRate = filteredOrders.length
    ? ((delivered.length / filteredOrders.length) * 100).toFixed(1)
    : 0;

  const cancelRate = filteredOrders.length
    ? ((cancelled.length / filteredOrders.length) * 100).toFixed(1)
    : 0;

  /* ================= TREND DATA ================= */
  const trendData = useMemo(() => {
    const map = {};

    filteredOrders.forEach(order => {
      const day = new Date(order.orderDate).toLocaleDateString();

      if (!map[day]) {
        map[day] = { day, revenue: 0, orders: 0 };
      }

      map[day].orders += 1;

      if (order.status === "DELIVERED") {
        const sellerItems = order.items?.filter(
          i => i.sellerEmail?.toLowerCase() === sellerEmail
        );

        const revenue = sellerItems?.reduce(
          (s, i) => s + i.price * i.quantity,
          0
        );

        map[day].revenue += revenue || 0;
      }
    });

    return Object.values(map);
  }, [filteredOrders, sellerEmail]);

  /* ================= EXPORT ================= */
 const exportReport = () => {
  const doc = new jsPDF();
  const reportDate = new Date().toLocaleDateString();

  const formatCurrency = (amount) =>
    `Rs. ${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  /* ================= HEADER ================= */
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, 210, 28, "F");

  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("ShopVerse Seller Performance Report", 14, 18);

  doc.setFontSize(10);
  doc.text(`Generated On: ${reportDate}`, 150, 18);

  doc.setTextColor(0, 0, 0);

  /* ================= CALCULATIONS ================= */
  const totalOrders = filteredOrders.length;
  const deliveredOrders = filteredOrders.filter(o => o.status === "DELIVERED");
  const cancelledOrders = filteredOrders.filter(o => o.status === "CANCELLED");
  const shippedOrders = filteredOrders.filter(o => o.status === "SHIPPED");

  const totalRevenue = deliveredOrders.reduce((sum, order) => {
    const sellerItems = order.items?.filter(
      i => i.sellerEmail?.toLowerCase() === sellerEmail
    );

    const revenue = sellerItems?.reduce(
      (s, i) => s + (i.price || 0) * (i.quantity || 0),
      0
    );

    return sum + (revenue || 0);
  }, 0);

  const avgOrderValue = deliveredOrders.length
    ? totalRevenue / deliveredOrders.length
    : 0;

  const deliveryRate = totalOrders
    ? ((deliveredOrders.length / totalOrders) * 100).toFixed(2)
    : 0;

  /* ================= EXECUTIVE SUMMARY ================= */
  doc.setFontSize(14);
  doc.text("Executive Summary", 14, 42);

  autoTable(doc, {
    startY: 48,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    head: [["Metric", "Value"]],
    body: [
      ["Seller Email", sellerEmail],
      ["Total Revenue", formatCurrency(totalRevenue)],
      ["Total Orders", totalOrders],
      ["Delivered Orders", deliveredOrders.length],
      ["Cancelled Orders", cancelledOrders.length],
      ["Shipped Orders", shippedOrders.length],
      ["Delivery Rate", `${deliveryRate}%`],
      ["Average Order Value", formatCurrency(avgOrderValue)],
    ],
    headStyles: {
      fillColor: [220, 38, 38],
      textColor: 255,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 50, halign: "right" },
    },
  });

  /* ================= ORDER BREAKDOWN ================= */
  doc.setFontSize(14);
  doc.text("Order Breakdown", 14, doc.lastAutoTable.finalY + 14);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    theme: "striped",
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    head: [["Order ID", "Date", "Status", "Revenue"]],
    body: filteredOrders.map(order => {
      const sellerItems = order.items?.filter(
        i => i.sellerEmail?.toLowerCase() === sellerEmail
      );

      const revenue = sellerItems?.reduce(
        (s, i) => s + (i.price || 0) * (i.quantity || 0),
        0
      );

      return [
        order.id,
        new Date(order.orderDate).toLocaleDateString(),
        order.status,
        formatCurrency(revenue),
      ];
    }),
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 65 },
      1: { cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30, halign: "right" },
    },
  });

  /* ================= FOOTER ================= */
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "This is a system-generated professional report from ShopVerse.",
    14,
    290
  );

  doc.save("ShopVerse-Seller-Professional-Report.pdf");
};
  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Analytics Overview
        </h2>

        <button
          onClick={exportReport}
          className="bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Download Report
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-6 rounded-xl shadow grid md:grid-cols-4 gap-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-3 rounded-lg"
        >
          <option value="LAST_7">Last 7 Days</option>
          <option value="LAST_30">Last 30 Days</option>
          <option value="LAST_90">Last 90 Days</option>
          <option value="CUSTOM_DATE">Custom Date</option>
          <option value="MONTH_RANGE">Month Range</option>
          <option value="YEAR_RANGE">Year Range</option>
        </select>

        {filterType === "CUSTOM_DATE" && (
          <>
            <input type="date" onChange={e=>setFromDate(e.target.value)} className="border p-3 rounded-lg"/>
            <input type="date" onChange={e=>setToDate(e.target.value)} className="border p-3 rounded-lg"/>
          </>
        )}

        {filterType === "MONTH_RANGE" && (
          <>
            <input type="month" onChange={e=>setFromMonth(e.target.value)} className="border p-3 rounded-lg"/>
            <input type="month" onChange={e=>setToMonth(e.target.value)} className="border p-3 rounded-lg"/>
          </>
        )}

        {filterType === "YEAR_RANGE" && (
          <>
            <input type="number" placeholder="From Year" onChange={e=>setFromYear(e.target.value)} className="border p-3 rounded-lg"/>
            <input type="number" placeholder="To Year" onChange={e=>setToYear(e.target.value)} className="border p-3 rounded-lg"/>
          </>
        )}
      </div>

      {/* BIG REVENUE CARD */}
      <div className="bg-white p-8 rounded-xl border shadow-sm">
        <p className="text-gray-500 text-sm">Total Revenue</p>
        <h1 className="text-4xl font-bold mt-2">
          ₹{totalRevenue}
        </h1>
      </div>

      {/* PERFORMANCE STRIP */}
      <div className="grid md:grid-cols-4 gap-6">
        <Metric label="Orders" value={filteredOrders.length} />
        <Metric label="Delivered %" value={`${deliveryRate}%`} />
        <Metric label="Cancelled %" value={`${cancelRate}%`} />
        <Metric label="Avg Order Value" value={`₹${avgOrderValue}`} />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white p-6 rounded-xl border shadow-sm h-[350px]">
          <h3 className="font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#dc2626"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm h-[350px]">
          <h3 className="font-semibold mb-4">Orders Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-800 mt-2">
        {value}
      </p>
    </div>
  );
}