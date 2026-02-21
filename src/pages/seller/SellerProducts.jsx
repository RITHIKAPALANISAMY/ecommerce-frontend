import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

import SellerProductCard from "../../components/seller/SellerProductCard";
import SellerAddProduct from "./SellerAddProduct";
import SellerEditProduct from "./SellerEditProduct";

import { Plus } from "lucide-react";

export default function SellerProducts() {
  const { user } = useAuth();
  const { getProductsBySeller, deleteProduct } = useProducts();
  const { orders } = useOrders();

  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const LOW_STOCK_LIMIT = 5;

  // ✅ Normalize seller email safely
  const sellerEmail = user?.email?.trim().toLowerCase();

  /* ================= FETCH SELLER PRODUCTS ================= */
  const fetchSellerProducts = useCallback(async () => {
    if (!sellerEmail) return;

    try {
      setLoading(true);

      const data = await getProductsBySeller(sellerEmail);

      // 🔥 Normalize product IDs here safely
      const normalized = (data || []).map((p) => ({
        ...p,
        id: p.id || p._id,
      }));

      setSellerProducts(normalized);

    } catch (err) {
      console.error("Failed to fetch seller products:", err);
    } finally {
      setLoading(false);
    }
  }, [sellerEmail, getProductsBySeller]);

  useEffect(() => {
    fetchSellerProducts();
  }, [fetchSellerProducts]);

  /* ================= CALCULATE SALES + REVENUE ================= */
  const productStats = useMemo(() => {
    if (!orders?.length) return sellerProducts;

    return sellerProducts.map((product) => {
      let sold = 0;

      orders.forEach((order) => {
        if (order.status?.toLowerCase() === "cancelled") return;

        order.items?.forEach((item) => {
          const orderedId = item.productId || item.id || item._id;

          if (orderedId === product.id) {
            sold += Number(item.quantity || 1);
          }
        });
      });

      return {
        ...product,
        sold,
        revenue: sold * Number(product.price || 0),
      };
    });
  }, [sellerProducts, orders]);

  /* ================= DELETE HANDLER ================= */
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await fetchSellerProducts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (!sellerEmail) return null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            My Products
          </h3>
          <p className="text-sm text-gray-500">
            {productStats.length} product
            {productStats.length !== 1 && "s"}
          </p>
        </div>

        <button
          onClick={() => setShowAddProduct(true)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center text-gray-500 p-10">
          Loading products...
        </div>
      ) : productStats.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">
          No products added yet
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productStats.map((product) => (
            <SellerProductCard
              key={product.id}
              product={product}
              lowStock={
                product.stock > 0 &&
                product.stock <= LOW_STOCK_LIMIT
              }
              outOfStock={product.stock === 0}
              onEdit={() => setEditProduct(product)}
              onDelete={() => handleDelete(product.id)}
            />
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {showAddProduct && (
        <SellerAddProduct
          onClose={() => {
            setShowAddProduct(false);
            fetchSellerProducts();
          }}
        />
      )}

      {/* EDIT MODAL */}
      {editProduct && (
        <SellerEditProduct
          product={editProduct}
          onClose={() => {
            setEditProduct(null);
            fetchSellerProducts();
          }}
        />
      )}
    </div>
  );
}
