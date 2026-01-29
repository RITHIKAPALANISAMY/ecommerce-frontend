import { useProducts } from "../../context/ProductContext";
import "./Products.css";

export default function Products() {
  const {
    products,
    approveProduct,
    rejectProduct,
    flagProduct,
    unflagProduct,
  } = useProducts();

  /* 🔹 READ ADMIN CATEGORIES */
  const categories =
    JSON.parse(localStorage.getItem("admin_categories")) || [];

  /* 🔹 HELPER: GET CATEGORY NAME */
  const getCategoryName = (cat) => {
    if (typeof cat === "string") return cat;

    if (typeof cat === "number") {
      return (
        categories.find((c) => c.id === cat)?.name || "Unknown"
      );
    }

    return "Unknown";
  };

  return (
    <div className="admin-products">
      <h2 className="section-title">Products Management</h2>

      <table className="products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Seller</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Risk</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => {
            const lowStock = p.stock !== undefined && p.stock < 5;

            return (
              <tr key={p.id}>
                {/* PRODUCT */}
                <td>
                  <div className="product-cell">
                    <img
                      src={p.image || "https://via.placeholder.com/60"}
                      alt={p.name}
                      className="product-img"
                    />
                    <span className="product-name">{p.name}</span>
                  </div>
                </td>

                <td>{p.seller || "Seller"}</td>

                {/* ✅ CATEGORY (NOW CONNECTED) */}
                <td>{getCategoryName(p.category)}</td>

                <td>₹{p.price}</td>

                {/* STOCK */}
                <td>
                  {p.stock ?? "—"}
                  {lowStock && (
                    <span className="low-stock"> Low</span>
                  )}
                </td>

                {/* STATUS */}
                <td>
                  <span className={`status ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </td>

                {/* RISK */}
                <td>
                  {p.flagged ? (
                    <span className="risk-badge">🚩 Flagged</span>
                  ) : (
                    <span className="safe-badge">Safe</span>
                  )}
                </td>

                {/* ACTION */}
                <td>
                  {p.status === "Pending" && (
                    <div className="action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => approveProduct(p.id)}
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => rejectProduct(p.id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {p.status !== "Pending" && (
                    <>
                      {p.flagged ? (
                        <button
                          className="unflag-btn"
                          onClick={() => unflagProduct(p.id)}
                        >
                          Unflag
                        </button>
                      ) : (
                        <button
                          className="flag-btn"
                          onClick={() => flagProduct(p.id)}
                        >
                          Flag
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
