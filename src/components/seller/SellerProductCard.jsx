import { useState } from "react";
import { useSellerProducts } from "../../context/SellerProductContext";
import SellerEditProduct from "../../pages/seller/SellerEditProduct";

export default function SellerProductCard({
  product,
  lowStock,
  outOfStock,
}) {
  const { deleteSellerProduct } = useSellerProducts();
  const [editing, setEditing] = useState(false);

  return (
    <>
      <div
        className={`seller-product-card
          ${outOfStock ? "out-of-stock" : ""}
          ${lowStock && !outOfStock ? "low-stock" : ""}
        `}
      >
        {/* STOCK BADGES */}
        {outOfStock && (
          <span className="stock-badge out">
            Out of Stock
          </span>
        )}

        {!outOfStock && lowStock && (
          <span className="stock-badge low">
            Low Stock
          </span>
        )}

        {/* PRODUCT IMAGE */}
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="seller-product-image"
        />

        {/* PRODUCT INFO */}
        <div className="seller-product-info">
          <h4>{product.title}</h4>
          <p className="category">{product.category}</p>

          <div className="price-row">
  <span className="price">₹{product.price}</span>
  <span className="stock">
    Stock: {product.stock}
  </span>
</div>


          {/* 🔥 BUSINESS METRICS (NEW) */}
          <div className="product-metrics">
            <span>
              Sold: <strong>{product.sold || 0}</strong>
            </span>
            <span>
              Revenue:{" "}
              <strong>
                ₹{product.revenue || 0}
              </strong>
            </span>
          </div>

          {/* ACTIONS */}
          <div className="card-actions">
            <button
              className="edit-btn"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() =>
                deleteSellerProduct(product.id)
              }
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal">
            <SellerEditProduct
              product={product}
              onClose={() => setEditing(false)}
            />
            <button
              className="close-btn"
              onClick={() => setEditing(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
