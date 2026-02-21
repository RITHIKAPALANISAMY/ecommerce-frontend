import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import SellerProducts from "./SellerProducts";
import {
  Package,
  IndianRupee,
  AlertTriangle,
  XCircle,
} from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { products, loading, fetchProducts } = useProducts();

  const [tab, setTab] = useState("overview");
  const [sellerProducts, setSellerProducts] = useState([]);

  const sellerEmail = user?.email?.trim().toLowerCase();

  /* ================= FETCH PRODUCTS WHEN DASHBOARD LOADS ================= */
  useEffect(() => {
    fetchProducts();
  }, []);

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

  /* ================= STATS ================= */
  const revenue = 0; // Replace later when order service ready
  const LOW_STOCK_LIMIT = 5;

  const lowStock = sellerProducts.filter(
    (p) => p.stock > 0 && p.stock <= LOW_STOCK_LIMIT
  ).length;

  const outOfStock = sellerProducts.filter(
    (p) => p.stock === 0
  ).length;
console.log("Logged in user:", user?.email);
console.log("All products:", products);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Seller Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            {sellerEmail}
          </p>
        </div>

        {/* TABS */}
        <div className="mb-8 inline-flex rounded-xl bg-white p-1 shadow-sm">
          {["overview", "products"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                tab === t
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500">Loading products...</p>
        )}

        {/* OVERVIEW TAB */}
        {tab === "overview" && !loading && (
          <div className="mb-10 rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-6 text-lg font-semibold text-gray-800">
              Store Performance
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Products"
                value={sellerProducts.length}
                icon={Package}
              />

              <StatCard
                title="Revenue"
                value={`₹${revenue}`}
                icon={IndianRupee}
              />

              <StatCard
                title="Low Stock"
                value={lowStock}
                icon={AlertTriangle}
              />

              <StatCard
                title="Out of Stock"
                value={outOfStock}
                icon={XCircle}
              />
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === "products" && !loading && (
          <SellerProducts sellerProducts={sellerProducts} />
        )}
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>
        <Icon className="h-5 w-5 text-gray-600" />
      </div>

      <p className="mt-4 text-3xl font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
}
