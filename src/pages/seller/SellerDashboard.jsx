import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { getSellerOrders } from "../../api/orderApi";

import SellerProducts from "./SellerProducts";
import SellerOrders from "./SellerOrders";
import SellerAnalytics from "./SellerAnalytics";

import {
  Package,
  IndianRupee,
  AlertTriangle,
  XCircle,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { products, loading, fetchProducts } = useProducts();

  const [tab, setTab] = useState("overview");
  const [sellerProducts, setSellerProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const sellerEmail = user?.email?.trim().toLowerCase();

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= FETCH SELLER ORDERS ================= */
  useEffect(() => {
    if (!sellerEmail) return;

    const fetchOrders = async () => {
      try {
        const res = await getSellerOrders(sellerEmail);
        setOrders(res.data || []);
      } catch (error) {
        console.error("Failed to fetch seller orders", error);
      }
    };

    fetchOrders();
  }, [sellerEmail]);

  /* ================= FILTER SELLER PRODUCTS ================= */
  useEffect(() => {
    if (!sellerEmail || !products) {
      setSellerProducts([]);
      return;
    }

    const filtered = products.filter(
      (p) =>
        p.sellerEmail?.trim().toLowerCase() === sellerEmail
    );

    setSellerProducts(filtered);
  }, [products, sellerEmail]);

  /* ================= CALCULATIONS ================= */
  const LOW_STOCK_LIMIT = 5;

  const lowStock = sellerProducts.filter(
    (p) => p.stock > 0 && p.stock <= LOW_STOCK_LIMIT
  ).length;

  const outOfStock = sellerProducts.filter(
    (p) => p.stock === 0
  ).length;

  const totalRevenue = useMemo(() => {
    return orders.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );
  }, [orders]);

  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (o) => o.status === "DELIVERED"
  ).length;

  const cancelledOrders = orders.filter(
    (o) => o.status === "CANCELLED"
  ).length;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "products", label: "Products" },
    { key: "orders", label: "Orders" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Seller Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            {sellerEmail}
          </p>
        </div>

        {/* TABS */}
        <div className="mb-10 flex flex-wrap gap-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                tab === t.key
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-white text-gray-600 shadow-sm hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-gray-500">Loading products...</p>
        )}

        {/* ================= OVERVIEW ================= */}
        {tab === "overview" && !loading && (
          <div className="rounded-2xl bg-white p-8 shadow-lg">

            <h3 className="mb-8 text-xl font-semibold text-gray-800">
              Business Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

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
                title="Delivered Orders"
                value={deliveredOrders}
                icon={CheckCircle}
                color="text-emerald-600"
              />

              <StatCard
                title="Cancelled Orders"
                value={cancelledOrders}
                icon={XCircle}
                color="text-red-600"
              />

              <StatCard
                title="Products"
                value={sellerProducts.length}
                icon={Package}
                color="text-purple-600"
              />

              <StatCard
                title="Low Stock"
                value={lowStock}
                icon={AlertTriangle}
                color="text-yellow-600"
              />

              <StatCard
                title="Out of Stock"
                value={outOfStock}
                icon={XCircle}
                color="text-red-500"
              />

            </div>
          </div>
        )}

        {/* ================= PRODUCTS ================= */}
        {tab === "products" && !loading && (
          <SellerProducts sellerProducts={sellerProducts} />
        )}

        {/* ================= ORDERS ================= */}
        {tab === "orders" && (
          <SellerOrders sellerEmail={sellerEmail} />
        )}

        {/* ================= ANALYTICS ================= */}
        {tab === "analytics" && (
          <SellerAnalytics sellerEmail={sellerEmail} />
        )}

      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>

      <p className="mt-4 text-3xl font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
}