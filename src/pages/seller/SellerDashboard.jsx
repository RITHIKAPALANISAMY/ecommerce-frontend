import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

import SellerProducts from "./SellerProducts";
import SellerOrders from "./SellerOrders";
import SellerAddProduct from "./SellerAddProduct";
import SellerRevenueReport from "../../components/seller/SellerRevenueReport";

import "../../styles/seller/seller.css";

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
  const { products } = useProducts();
  const { getSellerOrders, getSellerRevenue } = useOrders();

  const [tab, setTab] = useState("overview");
  

  const sellerId = user?.email;
  const seller = user?.sellerInfo;

  /* ================= SELLER PRODUCTS ================= */
  const sellerProducts = products.filter(
    (p) => p.sellerId === sellerId
  );

  /* ================= SELLER ORDERS ================= */
  const sellerOrders = sellerId ? getSellerOrders(sellerId) : [];

  /* ================= TOTAL REVENUE ================= */
  const revenue = sellerId ? getSellerRevenue(sellerId) : 0;

  /* ================= DAILY REVENUE ================= */
  const chartData = Object.values(
    sellerOrders.reduce((acc, order) => {
      const date = order.date;

      const orderRevenue = order.items.reduce(
        (s, i) => s + i.price * i.quantity,
        0
      );

      if (!acc[date]) acc[date] = { date, revenue: 0 };
      acc[date].revenue += orderRevenue;

      return acc;
    }, {})
  );

  /* ================= NEW DASHBOARD METRICS ================= */
  const pendingOrdersCount = useMemo(() => {
    return sellerOrders.filter(
      (o) => o.status === "Placed" || o.status === "Shipped"
    ).length;
  }, [sellerOrders]);

  const LOW_STOCK_LIMIT = 5;

  const lowStockCount = sellerProducts.filter(
    (p) => p.stock > 0 && p.stock <= LOW_STOCK_LIMIT
  ).length;

  const outOfStockCount = sellerProducts.filter(
    (p) => p.stock === 0
  ).length;

  return (
    <div className="seller-dashboard">

      {/* HEADER */}
      <div className="seller-header">
        <h2>Seller Dashboard</h2>
        <p>{user?.email}</p>
      </div>

      {/* SELLER INFO */}
      {seller ? (
        <div className="seller-info-card">
          <h3>{seller.storeName}</h3>
          <p><strong>Owner:</strong> {seller.ownerName || "—"}</p>
          <p><strong>Phone:</strong> {seller.phone}</p>
          {seller.gst && <p><strong>GST:</strong> {seller.gst}</p>}
          <p className="seller-address">{seller.address}</p>
        </div>
      ) : (
        <div className="seller-info-card">
          <p>Seller details not found. Please complete seller profile.</p>
        </div>
      )}

      {/* TABS */}
      <div className="seller-tabs">
        <button
          className={tab === "overview" ? "active" : ""}
          onClick={() => setTab("overview")}
        >
          OVERVIEW
        </button>
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          PRODUCTS
        </button>
        <button
          className={tab === "orders" ? "active" : ""}
          onClick={() => setTab("orders")}
        >
          ORDERS
        </button>
      </div>

      {/* CONTENT */}
      <div className="seller-content">

        {/* ================= OVERVIEW ================= */}
        {tab === "overview" && (
          <>
            {/* 🔹 ROW 1: ANALYTICS CARDS */}
            <div className="analytics-grid">

              <div className="analytics-card products">
                <span className="card-icon">📦</span>
                <p className="card-title">Products</p>
                <h3>{sellerProducts.length}</h3>
              </div>

              <div className="analytics-card orders">
                <span className="card-icon">🧾</span>
                <p className="card-title">Orders</p>
                <h3>{sellerOrders.length}</h3>
              </div>

              <div className="analytics-card revenue">
                <span className="card-icon">💰</span>
                <p className="card-title">Revenue</p>
                <h3>₹{revenue}</h3>
              </div>

              <div className="analytics-card chart">
                <p className="card-title">Daily Revenue</p>
                {chartData.length > 0 && (
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip formatter={(v) => `₹${v}`} />
                      <Bar
                        dataKey="revenue"
                        fill="#e11d48"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* ✅ NEW KPI CARDS */}
              <div className="analytics-card pending">
                <span className="card-icon">⏳</span>
                <p className="card-title">Pending Orders</p>
                <h3>{pendingOrdersCount}</h3>
              </div>

              <div className="analytics-card low-stock">
                <span className="card-icon">⚠️</span>
                <p className="card-title">Low Stock</p>
                <h3>{lowStockCount}</h3>
              </div>

              <div className="analytics-card out-stock">
                <span className="card-icon">❌</span>
                <p className="card-title">Out of Stock</p>
                <h3>{outOfStockCount}</h3>
              </div>

            </div>

            {/* 🔔 NOTIFICATIONS */}
            <div className="seller-notifications">
              <h4>Notifications</h4>

              {pendingOrdersCount > 0 && (
                <p>🆕 You have orders waiting for processing</p>
              )}

              {outOfStockCount > 0 && (
                <p>❗ Some products are out of stock</p>
              )}

              {lowStockCount > 0 && (
                <p>⚠️ Low stock items need restocking</p>
              )}

              {pendingOrdersCount === 0 &&
                lowStockCount === 0 &&
                outOfStockCount === 0 && (
                  <p>✅ All operations running smoothly</p>
                )}
            </div>

            {/* 🔹 ROW 2: FULL WIDTH REVENUE REPORT */}
            <div className="overview-section">
              <SellerRevenueReport />
            </div>
          </>
        )}

        {/* ================= PRODUCTS ================= */}
{tab === "products" && <SellerProducts />}


        {/* ================= ORDERS ================= */}
        {tab === "orders" && <SellerOrders />}

      </div>
    </div>
  );
}
