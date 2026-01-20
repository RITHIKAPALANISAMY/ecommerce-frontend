import { useMemo, useState } from "react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import "../../styles/seller/sellerRevenue.css";


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SellerRevenueReport() {
  const { orders } = useOrders();
  const { user } = useAuth();

  const [view, setView] = useState("weekly"); // weekly | monthly
  const sellerId = user.email;

  /* ================= FILTER SELLER ORDERS ================= */
  const sellerOrders = useMemo(() => {
    return orders.filter((order) =>
      order.items.some(
        (item) =>
          item.sellerId === sellerId &&
          item.status !== "Cancelled"
      )
    );
  }, [orders, sellerId]);

  /* ================= AGGREGATE DATA ================= */
  const chartData = useMemo(() => {
    const map = {};

    sellerOrders.forEach((order) => {
      let key;

      // order.date is already formatted (DD/MM/YYYY)
      if (view === "weekly") {
        key = order.date; // show per day (safe)
      } else {
        // Monthly grouping from DD/MM/YYYY
        const parts = order.date.split("/");
        const month = parts[1];
        const year = parts[2];
        key = `${month}/${year}`;
      }

      const revenue = order.items
        .filter(
          (item) =>
            item.sellerId === sellerId &&
            item.status !== "Cancelled"
        )
        .reduce(
          (sum, item) =>
            sum + item.price * item.quantity,
          0
        );

      map[key] = (map[key] || 0) + revenue;
    });

    return Object.entries(map).map(([key, value]) => ({
      period: key,
      revenue: value,
    }));
  }, [sellerOrders, sellerId, view]);

  /* ================= TOTAL REVENUE ================= */
  const totalRevenue = chartData.reduce(
    (sum, d) => sum + d.revenue,
    0
  );

  return (
    <div className="seller-revenue-card">
      <div className="revenue-header">
        <h3>Revenue Report</h3>

        <div className="revenue-toggle">
          <button
            className={view === "weekly" ? "active" : ""}
            onClick={() => setView("weekly")}
          >
            Weekly
          </button>
          <button
            className={view === "monthly" ? "active" : ""}
            onClick={() => setView("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="revenue-summary">
        <p>Total Revenue</p>
        <h2>₹{totalRevenue}</h2>
      </div>

      <div className="revenue-chart">
        {chartData.length === 0 ? (
          <p className="empty">No sales data available.</p>
        ) : (
<ResponsiveContainer width="100%" height={280}>
  <BarChart
    data={chartData}
    barCategoryGap={6}   // 🔥 REDUCES HUGE SPACES
    barGap={2}
    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
  >
    <XAxis
      dataKey="period"
      tick={{ fontSize: 12 }}
      axisLine={false}
      tickLine={false}
    />
    <YAxis hide />

    <Tooltip formatter={(v) => `₹${v}`} />

    <Bar
  dataKey="revenue"
  barSize={36}     // 👈 looks better with fewer bars
  radius={[8, 8, 0, 0]}
  fill="#16a34a"
/>

  </BarChart>
</ResponsiveContainer>



        )}
      </div>
    </div>
  );
}
