import { Pencil, Trash2, AlertTriangle, XCircle } from "lucide-react";
import { useSellerProducts } from "../../context/SellerProductContext";
import SellerEditProduct from "../../pages/seller/SellerEditProduct";
import { useState } from "react";

export default function SellerProductCard({
  product,
  lowStock,
  outOfStock,
}) {
  const { deleteSellerProduct } = useSellerProducts();
  const [editOpen, setEditOpen] = useState(false);

  const image =
    product.images?.[0] ||
    product.image ||
    "/placeholder.png";

  return (
    <>
      <div className="relative rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">

        {/* 🔴 ALERT BADGES */}
        {outOfStock && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
            <XCircle size={14} />
            Out of Stock
          </span>
        )}

        {!outOfStock && lowStock && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
            <AlertTriangle size={14} />
            Low Stock
          </span>
        )}

        {/* IMAGE */}
        <img
          src={image}
          alt={product.title}
          className="mb-3 h-44 w-full rounded-lg object-cover"
        />

        {/* INFO */}
        <h4 className="font-semibold text-gray-800">
          {product.title}
        </h4>
        <p className="text-sm text-gray-500">
          {product.category}
        </p>

        <div className="mt-2 space-y-1 text-sm">
          <p>
            <strong>₹{product.price}</strong>
          </p>
          <p>Stock: {product.stock}</p>
          <p>Sold: {product.sold}</p>
          <p>Revenue: ₹{product.revenue}</p>
        </div>

        {/* ACTIONS */}
        <div className="mt-4 flex gap-4 text-sm">
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            <Pencil size={14} /> Edit
          </button>

          <button
            onClick={() => deleteSellerProduct(product.id)}
            className="flex items-center gap-1 text-red-600 hover:underline"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <SellerEditProduct
          product={product}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
