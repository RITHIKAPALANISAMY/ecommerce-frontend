import React, { useState } from "react";

const productsData = [
  { id: 1, name: "Organic Face Cream", seller: "Priya Store", category: "Beauty", price: 499, status: "Pending" },
  { id: 2, name: "Eco Shopping Bag", seller: "Green Mart", category: "Eco-Friendly", price: 199, status: "Approved" },
  { id: 3, name: "Wireless Earbuds", seller: "Tech Hub", category: "Electronics", price: 1299, status: "Pending" },
];

export default function ProductsApproval() {
  const [products, setProducts] = useState(productsData);

  const handleAction = (id, action) => {
    const confirmed = window.confirm(`Are you sure you want to ${action.toLowerCase()} this product?`);
    if (!confirmed) return;

    setProducts(products.map(p => {
      if (p.id === id) {
        return { ...p, status: action === "Approve" ? "Approved" : "Rejected" };
      }
      return p;
    }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Products Approval</h2>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "Arial, sans-serif"
      }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
            <th style={{ padding: "10px" }}>Product</th>
            <th style={{ padding: "10px" }}>Seller</th>
            <th style={{ padding: "10px" }}>Category</th>
            <th style={{ padding: "10px" }}>Price</th>
            <th style={{ padding: "10px" }}>Status</th>
            <th style={{ padding: "10px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} style={{ borderBottom: "1px solid #eee", height: "50px" }}>
              <td style={{ padding: "10px" }}>{product.name}</td>
              <td style={{ padding: "10px" }}>{product.seller}</td>
              <td style={{ padding: "10px" }}>{product.category}</td>
              <td style={{ padding: "10px" }}>₹{product.price}</td>
              <td style={{ padding: "10px" }}>
                <span style={{
                  padding: "5px 10px",
                  borderRadius: "15px",
                  backgroundColor: product.status === "Approved" ? "#d4f5d4" :
                                   product.status === "Rejected" ? "#f8d6d6" : "#ffe6b3",
                  color: product.status === "Approved" ? "green" :
                         product.status === "Rejected" ? "red" : "orange",
                  fontWeight: "bold",
                  fontSize: "14px"
                }}>
                  {product.status}
                </span>
              </td>
              <td style={{ padding: "10px" }}>
                {product.status === "Pending" ? (
                  <>
                    <button
                      style={{ 
                        backgroundColor: "green", color: "white", marginRight: "10px", padding: "8px 15px", border: "none", borderRadius: "5px", cursor: "pointer"
                      }}
                      onClick={() => handleAction(product.id, "Approve")}>
                      Approve
                    </button>
                    <button
                      style={{ 
                        backgroundColor: "red", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px", cursor: "pointer"
                      }}
                      onClick={() => handleAction(product.id, "Reject")}>
                      Reject
                    </button>
                  </>
                ) : (
                  <button disabled style={{ padding: "8px 15px", borderRadius: "5px", cursor: "not-allowed" }}>{product.status}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
