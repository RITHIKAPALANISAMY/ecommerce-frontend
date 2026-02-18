import { useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function SellerRevenueAnalytics({ sellerOrders }) {
  const [range, setRange] = useState("monthly");
  const chartRef = useRef(null);

  /* ================= NORMALIZED DATA ================= */
  const data = useMemo(() => {
    const map = new Map();

    sellerOrders.forEach((order) => {
      if (order.status?.toLowerCase() === "cancelled") return;

      const date = new Date(order.createdAt || order.placedDate);
      if (isNaN(date)) return;

      let label;

      if (range === "daily") {
        label = date.toISOString().slice(0, 10);
      } else if (range === "weekly") {
        const week = Math.ceil(date.getDate() / 7);
        label = `${date.toLocaleString("default", {
          month: "short",
        })} W${week}`;
      } else {
        label = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
      }

      const revenue = order.items.reduce(
        (sum, item) =>
          sum +
          Number(item.price || 0) *
            Number(item.quantity || 1),
        0
      );

      map.set(label, (map.get(label) || 0) + revenue);
    });

    return Array.from(map.entries())
      .map(([label, revenue]) => ({ label, revenue }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [sellerOrders, range]);

  /* ================= DOWNLOADS ================= */
  const downloadCSV = () => {
    let csv = "Label,Revenue\n";
    data.forEach((d) => {
      csv += `${d.label},${d.revenue}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${range}-revenue.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadImage = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = `${range}-revenue.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const pdf = new jsPDF("landscape");
    pdf.text("Revenue Analytics", 10, 10);
    pdf.addImage(canvas.toDataURL(), "PNG", 10, 20, 270, 150);
    pdf.save(`${range}-revenue.pdf`);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      {/* HEADER */}
      <div className="mb-4 flex justify-between">
        <h3 className="text-lg font-semibold">
          Revenue Analytics
        </h3>

        <div className="flex gap-2">
          {["daily", "weekly", "monthly"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-4 py-1 text-sm ${
                range === r
                  ? "bg-red-600 text-white"
                  : "border text-gray-600"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* CHART */}
      <div ref={chartRef} className="h-[320px]">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#dc2626"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No revenue data
          </div>
        )}
      </div>

      {/* DOWNLOADS */}
      <div className="mt-4 flex gap-3">
        <button onClick={downloadCSV} className="border px-4 py-2 rounded">
          CSV
        </button>
        <button onClick={downloadImage} className="border px-4 py-2 rounded">
          PNG
        </button>
        <button onClick={downloadPDF} className="border px-4 py-2 rounded">
          PDF
        </button>
      </div>
    </div>
  );
}
