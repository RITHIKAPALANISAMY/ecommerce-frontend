import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

import SellerProducts from "./SellerProducts";
import SellerOrders from "./SellerOrders";
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

  /* ================= DATA ================= */
  const sellerProducts = products.filter(p => p.sellerId === sellerId);
  const sellerOrders = sellerId ? getSellerOrders(sellerId) : [];
  const revenue = sellerId ? getSellerRevenue(sellerId) : 0;

  /* ================= DAILY REVENUE ================= */
  const chartData = Object.values(
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

  /* ================= METRICS ================= */
  const pendingOrdersCount = useMemo(
    () =>
      sellerOrders.filter(
        o => o.status === "Placed" || o.status === "Shipped"
      ).length,
    [sellerOrders]
  );

  const LOW_STOCK_LIMIT = 5;

  const lowStockCount = sellerProducts.filter(
    p => p.stock > 0 && p.stock <= LOW_STOCK_LIMIT
  ).length;

  const outOfStockCount = sellerProducts.filter(
    p => p.stock === 0
  ).length;

  return (
    <div className="seller-dashboard">

      {/* ================= HEADER ================= */}
      <div className="seller-header">
        <h2>Seller Dashboard</h2>
        <p>{user?.email}</p>
      </div>

      {/* ================= SELLER INFO ================= */}
      {seller && (
        <div className="seller-info-card">
          <h3>{seller.storeName}</h3>
          <p><strong>Owner:</strong> {seller.ownerName || "—"}</p>
          <p><strong>Phone:</strong> {seller.phone}</p>
          {seller.gst && <p><strong>GST:</strong> {seller.gst}</p>}
          <p>{seller.address}</p>
        </div>
      )}

      {/* ================= TABS ================= */}
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

      {/* ================= CONTENT ================= */}
      {tab === "overview" && (
        <>
          {/* ================= METRICS GRID ================= */}
          <div className="seller-metrics-grid">

            <div className="seller-metric-card seller-products">
              <div className="seller-metric-icon">📦</div>
              <div className="seller-metric-text">
                <span className="seller-metric-title">Products</span>
                <span className="seller-metric-value">
                  {sellerProducts.length}
                </span>
              </div>
            </div>

            <div className="seller-metric-card seller-orders">
              <div className="seller-metric-icon">🧾</div>
              <div className="seller-metric-text">
                <span className="seller-metric-title">Orders</span>
                <span className="seller-metric-value">
                  {sellerOrders.length}
                </span>
              </div>
            </div>

            <div className="seller-metric-card seller-revenue">
              <div className="seller-metric-icon">💰</div>
              <div className="seller-metric-text">
                <span className="seller-metric-title">Revenue</span>
                <span className="seller-metric-value">
                  ₹{revenue}
                </span>
              </div>
            </div>

            <div className="seller-metric-card seller-chart-card">
              <span className="seller-metric-title">Daily Revenue</span>
              <ResponsiveContainer width="100%" height={70}>
                <BarChart data={chartData}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip formatter={v => `₹${v}`} />
                  <Bar
                    dataKey="revenue"
                    fill="#e11d48"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

<<<<<<< HEAD
            <div className="seller-metric-card seller-pending">
              <div className="seller-metric-icon">⏳</div>
              <div className="seller-metric-text">
                <span className="seller-metric-title">Pending Orders</span>
                <span className="seller-metric-value">
                  {pendingOrdersCount}
                </span>
              </div>
            </div>

            <div className="seller-metric-card seller-lowstock">
              <div className="seller-metric-icon">⚠️</div>
              <div className="seller-metric-text">
                <span className="seller-metric-title">Low Stock</span>
                <span className="seller-metric-value">
                  {lowStockCount}
                </span>
              </div>
            </div>

            <div className="seller-metric-card seller-outstock">
              <div className="seller-metric-icon">❌</div>
              <div className="seller-metric-text">
                <span className="seller-metric-title">Out of Stock</span>
                <span className="seller-metric-value">
                  {outOfStockCount}
                </span>
              </div>
            </div>

          </div>

          {/* ================= REVENUE SECTION ================= */}
          <div className="overview-section">
            <SellerRevenueReport />
          </div>
        </>
      )}

      {tab === "products" && <SellerProducts />}
      {tab === "orders" && <SellerOrders />}
=======
        {/* ================= ORDERS ================= */}
        {tab === "orders" && <SellerOrders />}
>>>>>>> main

    </div>
  );
}
