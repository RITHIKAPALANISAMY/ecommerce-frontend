import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSellerProducts } from "../../context/SellerProductContext";
import { useOrders } from "../../context/OrderContext";

import SellerRevenueAnalytics from "../../components/seller/SellerRevenueAnalytics";
import SellerProducts from "./SellerProducts";
import SellerOrders from "./SellerOrders";

import {
  Package,
  ShoppingCart,
  IndianRupee,
  Clock,
  AlertTriangle,
  XCircle,
} from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { sellerProducts } = useSellerProducts();
  const { orders } = useOrders();

  const [tab, setTab] = useState("overview");

  const sellerId = user?.email;
  const seller = user?.sellerInfo;

  /* ================= SELLER ORDERS ================= */
  const sellerOrders = useMemo(() => {
    if (!sellerId) return [];

    return orders
      .map((order) => {
        const items = order.items.filter(
          (i) => i.sellerId === sellerId
        );
        return items.length ? { ...order, items } : null;
      })
      .filter(Boolean);
  }, [orders, sellerId]);

  /* ================= TOTAL REVENUE ================= */
  const revenue = useMemo(() => {
    return sellerOrders.reduce((total, order) => {
      if (order.status === "Cancelled") return total;

      const orderRevenue = order.items.reduce((sum, item) => {
        if (item.status === "Cancelled") return sum;
        return sum + Number(item.price || 0) * Number(item.quantity || 1);
      }, 0);

      return total + orderRevenue;
    }, 0);
  }, [sellerOrders]);

  /* ================= STATS ================= */
  const pendingOrders = sellerOrders.filter(
    (o) => o.status === "Placed" || o.status === "Shipped"
  ).length;

  const LOW_STOCK_LIMIT = 5;

  const lowStock = sellerProducts.filter(
    (p) => p.stock > 0 && p.stock <= LOW_STOCK_LIMIT
  ).length;

  const outOfStock = sellerProducts.filter(
    (p) => p.stock === 0
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Seller Dashboard
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* SELLER INFO */}
        {seller && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-md border-l-4 border-red-600">
            <h3 className="text-lg font-semibold text-gray-800">
              {seller.storeName}
            </h3>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p><strong>Owner:</strong> {seller.ownerName || "—"}</p>
              <p><strong>Phone:</strong> {seller.phone}</p>
              {seller.gst && <p><strong>GST:</strong> {seller.gst}</p>}
              <p>{seller.address}</p>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="mb-8 inline-flex rounded-xl bg-white p-1 shadow-sm">
          {["overview", "products", "orders"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                tab === t
                  ? "bg-red-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <>
            {/* STAT CARDS */}
            <div className="mb-10 rounded-2xl bg-white p-6 shadow-md">
              <h3 className="mb-6 text-lg font-semibold text-gray-800">
                Store Performance
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  title="Products"
                  value={sellerProducts.length}
                  icon={Package}
                  accent="bg-indigo-100 text-indigo-600"
                />
                <StatCard
                  title="Orders"
                  value={sellerOrders.length}
                  icon={ShoppingCart}
                  accent="bg-blue-100 text-blue-600"
                />
                <StatCard
                  title="Revenue"
                  value={`₹${revenue}`}
                  icon={IndianRupee}
                  accent="bg-green-100 text-green-600"
                />
                <StatCard
                  title="Pending Orders"
                  value={pendingOrders}
                  icon={Clock}
                  accent="bg-yellow-100 text-yellow-600"
                />
                <StatCard
                  title="Low Stock"
                  value={lowStock}
                  icon={AlertTriangle}
                  accent="bg-orange-100 text-orange-600"
                />
                <StatCard
                  title="Out of Stock"
                  value={outOfStock}
                  icon={XCircle}
                  accent="bg-red-100 text-red-600"
                />
              </div>
            </div>

            {/* ADVANCED REVENUE ANALYTICS */}
            <SellerRevenueAnalytics sellerOrders={sellerOrders} />
          </>
        )}

        {tab === "products" && <SellerProducts />}
        {tab === "orders" && <SellerOrders />}
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value, icon: Icon, accent }) {
  return (
    <div className="group rounded-xl border bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-gray-800">{value}</p>
      <div className="mt-2 h-1 w-10 rounded-full bg-gray-200 group-hover:bg-red-500 transition" />
    </div>
  );
}
