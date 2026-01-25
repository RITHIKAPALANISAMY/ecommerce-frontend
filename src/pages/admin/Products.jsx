import { useProducts } from "../../context/ProductContext";
import "./Products.css";

export default function Products() {
  
  const {
    products,
    approveProduct,
    rejectProduct,
  } = useProducts();

  return (
    <div className="admin-products">
      <h2 className="section-title">Products Approval</h2>

      <table className="products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Seller</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              {/* PRODUCT (IMAGE + NAME) */}
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

              <td>Seller</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>

              {/* STATUS */}
              <td>
                <span className={`status ${p.status.toLowerCase()}`}>
                  {p.status}
                </span>
              </td>

              {/* ACTION */}
              <td>
                {p.status === "Pending" ? (
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
                ) : (
                  <button className="disabled-btn">
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
