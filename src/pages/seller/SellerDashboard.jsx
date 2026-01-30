import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

import SellerProducts from "./SellerProducts";
import SellerOrders from "./SellerOrders";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { products = [] } = useProducts();

  const orderContext = useOrders() || {};
  const getSellerOrders =
    typeof orderContext.getSellerOrders === "function"
      ? orderContext.getSellerOrders
      : () => [];

  const getSellerRevenue =
    typeof orderContext.getSellerRevenue === "function"
      ? orderContext.getSellerRevenue
      : () => 0;

  const [tab, setTab] = useState("overview");

  const sellerId = user?.email || "";
  const seller = user?.sellerInfo;

  /* ================= DATA ================= */
  const sellerProducts = useMemo(
    () => products.filter(p => p.sellerId === sellerId),
    [products, sellerId]
  );

  const sellerOrders = useMemo(
    () => (sellerId ? getSellerOrders(sellerId) : []),
    [sellerId, getSellerOrders]
  );

  const revenue = useMemo(
    () => (sellerId ? getSellerRevenue(sellerId) : 0),
    [sellerId, getSellerRevenue]
  );

  /* ================= DAILY REVENUE ================= */
  const chartData = useMemo(() => {
    return Object.values(
      sellerOrders.reduce((acc, order) => {
        const date = order.date;
        const amount = order.items.reduce(
          (s, i) => s + i.price * i.quantity,
          0
        );

        if (!acc[date]) acc[date] = { date, revenue: 0 };
        acc[date].revenue += amount;
        return acc;
      }, {})
    );
  }, [sellerOrders]);

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4 space-y-6">

        {/* ================= HEADER ================= */}
        <div>
          <h2 className="text-2xl font-semibold">
            Seller Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            {user?.email}
          </p>
        </div>

        {/* ================= SELLER INFO ================= */}
        {seller && (
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold">
              {seller.storeName}
            </h3>
            <p className="text-sm text-gray-600">
              <strong>Owner:</strong> {seller.ownerName || "—"}
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> {seller.phone}
            </p>
            {seller.gst && (
              <p className="text-sm">
                <strong>GST:</strong> {seller.gst}
              </p>
            )}
            <p className="text-sm text-gray-500">
              {seller.address}
            </p>
          </div>
        )}

        {/* ================= TABS ================= */}
        <div className="flex gap-3">
          {["overview", "products", "orders"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition
                ${
                  tab === t
                    ? "bg-rose-500 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ================= OVERVIEW ================= */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <OverviewCard title="Products" value={sellerProducts.length} icon="📦" />
            <OverviewCard title="Orders" value={sellerOrders.length} icon="🧾" />
            <OverviewCard title="Revenue" value={`₹${revenue}`} icon="💰" />

            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm font-medium mb-2">
                Daily Revenue
              </p>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={chartData}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip formatter={v => `₹${v}`} />
                  <Bar
                    dataKey="revenue"
                    fill="#f43f5e"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

        {/* ================= PRODUCTS ================= */}
        {tab === "products" && <SellerProducts />}

        {/* ================= ORDERS ================= */}
        {tab === "orders" && (
          <div className="bg-gray-100 rounded-xl p-4">
            <SellerOrders />
          </div>
        )}

      </div>
    </div>
  );
}

/* ================= SMALL CARD ================= */
function OverviewCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
