import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSellerProducts } from "../../context/SellerProductContext";
import { useOrders } from "../../context/OrderContext";

import SellerProductCard from "../../components/seller/SellerProductCard";
import SellerAddProduct from "./SellerAddProduct";
import SellerEditProduct from "./SellerEditProduct";

import { Plus } from "lucide-react";

export default function SellerProducts() {
  const { user } = useAuth();
  const { sellerProducts, deleteSellerProduct } = useSellerProducts();
  const { orders } = useOrders();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const sellerId = user?.email;
  const LOW_STOCK_LIMIT = 5;

  /* ================= PRODUCT STATS ================= */
  const productStats = useMemo(() => {
    return sellerProducts.map((product) => {
      const sold = orders
        .flatMap((o) => o.items || []) // ✅ SAFE
        .filter(
          (i) =>
            i.productId === product.id &&
            i.sellerId === sellerId &&
            i.status !== "Cancelled"
        )
        .reduce((sum, i) => {
          const qty = Number(i.quantity || 1);
          return sum + qty;
        }, 0);

      return {
        ...product,
        sold,
        revenue: sold * Number(product.price || 0),
      };
    });
  }, [sellerProducts, orders, sellerId]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">

      {/* ================= HEADER ================= */}
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

      {/* ================= GRID ================= */}
      {productStats.length === 0 ? (
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
              onDelete={() => deleteSellerProduct(product.id)}
            />
          ))}
        </div>
      )}

      {/* ================= ADD MODAL ================= */}
      {showAddProduct && (
        <SellerAddProduct
          onClose={() => setShowAddProduct(false)}
        />
      )}

      {/* ================= EDIT MODAL ================= */}
      {editProduct && (
        <SellerEditProduct
          product={editProduct}
          onClose={() => setEditProduct(null)}
        />
      )}
    </div>
  );
}
