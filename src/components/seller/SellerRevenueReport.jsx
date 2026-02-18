import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SellerRevenueReport() {
  const { user } = useAuth();
  const { orders } = useOrders();

  const sellerId = user?.email;

 
  const chartData = useMemo(() => {
    if (!sellerId) return [];

    let cumulative = 0;

    return orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (i) =>
            i.sellerId === sellerId &&
            i.status !== "Cancelled"
        );

        if (!sellerItems.length) return null;

        const orderRevenue = sellerItems.reduce(
          (sum, i) =>
            sum +
            Number(i.price || 0) *
              Number(i.quantity || 1),
          0
        );

        cumulative += orderRevenue;

        return {
          label: `${order.placedDate} ${order.placedTime || ""}`,
          revenue: cumulative,
        };
      })
      .filter(Boolean);
  }, [orders, sellerId]);

  const totalRevenue =
    chartData.length > 0
      ? chartData[chartData.length - 1].revenue
      : 0;

  const avgOrderValue =
    chartData.length > 0
      ? Math.round(totalRevenue / chartData.length)
      : 0;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Revenue Overview
      </h3>

  
      <div className="mb-6 flex gap-12 text-sm">
        <div>
          <p className="text-gray-500">Total Revenue</p>
          <p className="text-xl font-semibold">
            ₹{totalRevenue}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Avg Order Value</p>
          <p className="text-xl font-semibold">
            ₹{avgOrderValue}
          </p>
        </div>
      </div>

  
      {chartData.length === 0 ? (
        <p className="text-center text-sm text-gray-400">
          No revenue yet
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
            />
            <YAxis />
            <Tooltip formatter={(v) => `₹${v}`} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
