import { useMemo, useState } from "react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import "../../styles/seller/sellerRevenue.css";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SellerRevenueReport() {
  const { orders = [] } = useOrders();
  const { user } = useAuth();

  const [view, setView] = useState("weekly");
  const sellerId = user?.email;

  /* ================= FILTER SELLER ORDERS ================= */
  const sellerOrders = useMemo(() => {
    if (!sellerId) return [];

    return orders.filter((order) =>
      order.items?.some(
        (item) =>
          item.sellerId === sellerId &&
          item.status !== "Cancelled"
      )
    );
  }, [orders, sellerId]);

  /* ================= CHART DATA ================= */
  const chartData = useMemo(() => {
    const map = {};

    sellerOrders.forEach((order) => {
      let key;

      if (view === "weekly") {
        key = order.date;
      } else {
        const [, month, year] = order.date.split("/");
        key = `${month}/${year}`;
      }

      const revenue = order.items
        .filter(
          (i) =>
            i.sellerId === sellerId &&
            i.status !== "Cancelled"
        )
        .reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );

      map[key] = (map[key] || 0) + revenue;
    });

    return Object.entries(map).map(([k, v]) => ({
      label: k,
      revenue: v,
    }));
  }, [sellerOrders, sellerId, view]);

  const totalRevenue = chartData.reduce(
    (s, d) => s + d.revenue,
    0
  );

  return (
    <div className="seller-revenue-modern">
      {/* HEADER */}
      <div className="revenue-top">
        <h3>Revenue Overview</h3>

        <div className="toggle">
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

      {/* METRICS */}
      <div className="revenue-metrics">
        <div>
          <span>Total Revenue</span>
          <strong>₹{totalRevenue}</strong>
        </div>
        <div>
          <span>Avg Order Value</span>
          <strong>
            ₹
            {chartData.length
              ? Math.round(
                  totalRevenue / chartData.length
                )
              : 0}
          </strong>
        </div>
      </div>

      {/* CHART */}
      <div className="revenue-chart-modern">
        {chartData.length === 0 ? (
          <p className="empty">No revenue data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#22c55e"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="#22c55e"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                hide
              />

              <Tooltip
                formatter={(v) => `₹${v}`}
                labelStyle={{ fontWeight: 600 }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
