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
        {/* BADGE */}
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

        <img
          src={product.images?.[0]}
          alt={product.title}
          className="seller-product-image"
        />

        <div className="seller-product-info">
          <h4>{product.title}</h4>
          <p>{product.category}</p>
          <p>₹{product.price}</p>
          <p>Stock: {product.stock}</p>

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
