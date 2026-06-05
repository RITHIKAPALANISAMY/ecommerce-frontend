import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { getSellerOrders } from "../../api/orderApi";
import {
  IndianRupee,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const sellerEmail = user?.email?.trim().toLowerCase();

  /* ================= FETCH SELLER ORDERS ================= */
  useEffect(() => {
    if (!sellerEmail) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getSellerOrders(sellerEmail);
        setOrders(res.data || []);
      } catch (error) {
        console.error("Failed to fetch seller orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sellerEmail]);

  /* ================= ORDER FILTERS ================= */

  const deliveredOrders = useMemo(
    () => orders.filter((o) => o.status === "DELIVERED"),
    [orders]
  );

  const shippedOrders = useMemo(
    () => orders.filter((o) => o.status === "SHIPPED"),
    [orders]
  );

  const cancelledOrders = useMemo(
    () => orders.filter((o) => o.status === "CANCELLED"),
    [orders]
  );

  /* ================= REVENUE ================= */

  const totalRevenue = useMemo(() => {
    if (!sellerEmail) return 0;

    return deliveredOrders.reduce((sum, order) => {
      const sellerItems = order.items?.filter(
        (item) =>
          item.sellerEmail?.toLowerCase() === sellerEmail
      );

      const sellerRevenue = sellerItems?.reduce(
        (itemSum, item) =>
          itemSum +
          (item.price || 0) * (item.quantity || 1),
        0
      );

      return sum + (sellerRevenue || 0);
    }, 0);
  }, [deliveredOrders, sellerEmail]);

  const totalOrders = orders.length;
  const deliveredCount = deliveredOrders.length;
  const shippedCount = shippedOrders.length;
  const cancelledCount = cancelledOrders.length;

  const avgOrderValue = useMemo(() => {
    if (deliveredCount === 0) return 0;
    return Math.round(totalRevenue / deliveredCount);
  }, [totalRevenue, deliveredCount]);

  const deliveryRate = totalOrders
    ? Math.round((deliveredCount / totalOrders) * 100)
    : 0;

  const cancellationRate = totalOrders
    ? Math.round((cancelledCount / totalOrders) * 100)
    : 0;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-gray-500 animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {sellerEmail}
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue}`}
          icon={IndianRupee}
          color="text-green-600"
        />

        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
          color="text-blue-600"
        />

        <StatCard
          title="Delivered"
          value={deliveredCount}
          icon={CheckCircle}
          color="text-emerald-600"
        />

        <StatCard
          title="Cancelled"
          value={cancelledCount}
          icon={XCircle}
          color="text-red-600"
        />
      </div>

      {/* SECOND SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BUSINESS SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Business Summary
          </h3>

          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Shipped Orders: <strong>{shippedCount}</strong>
            </p>
            <p>
              Average Order Value: <strong>₹{avgOrderValue}</strong>
            </p>
          </div>
        </div>

        {/* PERFORMANCE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Performance
          </h3>

          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 text-sm">Delivery Rate</p>
              <p className="text-2xl font-bold text-emerald-600">
                {deliveryRate}%
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Cancellation Rate</p>
              <p className="text-2xl font-bold text-red-600">
                {cancellationRate}%
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">{title}</p>
        <div className="p-2 rounded-lg bg-gray-100">
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>

      <p className="text-3xl font-bold mt-4 text-gray-800">
        {value}
      </p>
    </div>
  );
}