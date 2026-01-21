import React from "react";
import { useProducts } from "../../context/ProductContext";
import "./Products.css";

export default function ProductsApproval() {
  const { products, approveProduct, rejectProduct } = useProducts();

  const handleAction = (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action}?`)) return;
    action === "Approve" ? approveProduct(id) : rejectProduct(id);
  };

  return (
    <div className="products-approval">
      <h2>Products Approval</h2>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Seller</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              {/* IMAGE */}
              <td>
                <img
                  src={p.image}
                  alt={p.name}
                  className="product-image"
                />
              </td>

              {/* NAME */}
              <td className="product-name">{p.name}</td>

              <td>{p.seller || "Seller"}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>

              {/* STATUS */}
              <td>
                <span className={`status ${p.status.toLowerCase()}`}>
                  {p.status}
                </span>
              </td>

              {/* ACTION */}
              <td style={{ textAlign: "center" }}>
                {p.status === "Pending" ? (
                  <div className="action-group">
                    <button
                      className="btn approve"
                      onClick={() => handleAction(p.id, "Approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn reject"
                      onClick={() => handleAction(p.id, "Reject")}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <button className="btn disabled" disabled>
                    {p.status}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
