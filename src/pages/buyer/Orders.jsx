import "../../styles/orders.css";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";
import { useState } from "react";

export default function Orders() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { getBuyerOrders } = useOrders();

  // ✅ FIX: use buyerId instead of email
  const orders = user ? getBuyerOrders(user.id) : [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openOrderId, setOpenOrderId] = useState(null);

  // REVIEW STATES
  const [reviewProduct, setReviewProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const deliveredCount = orders.filter(o => o.status === "Delivered").length;
  const cancelledCount = orders.filter(o => o.status === "Cancelled").length;

  const filteredOrders = orders.filter(order => {
    const matchSearch = order.items.some(i =>
      i.title.toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getProductImage = (item) => {
    return (
      item.image ||
      products.find(p => p.id === item.productId)?.image ||
      "/placeholder.png"
    );
  };

  // ===== REVIEW HELPERS =====
  const getReviews = () =>
    JSON.parse(localStorage.getItem("reviews") || "[]");

  const hasReviewed = (productId) => {
    const reviews = getReviews();
    return reviews.some(
      r => r.productId === productId && r.userEmail === user.email
    );
  };

  const submitReview = () => {
    const reviews = getReviews();

    reviews.push({
      id: Date.now(),
      productId: reviewProduct.productId,
      userEmail: user.email,
      rating,
      comment,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem("reviews", JSON.stringify(reviews));

    setReviewProduct(null);
    setRating(0);
    setComment("");
  };

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {/* SUMMARY */}
      <div className="orders-summary">
        <div><strong>{orders.length}</strong><span>Total Orders</span></div>
        <div><strong>{deliveredCount}</strong><span>Delivered</span></div>
        <div><strong>{cancelledCount}</strong><span>Cancelled</span></div>
      </div>

      {/* FILTER */}
      <div className="orders-toolbar">
        <input
          placeholder="Search your orders"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="Delivered">Delivered</option>
          <option value="Shipped">Shipped</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* ORDERS */}
      {filteredOrders.map(order => {
        const total = order.items.reduce(
          (sum, i) => sum + i.price * (i.quantity || 1),
          0
        );

        const firstItem = order.items[0];

        return (
          <div key={order.id} className="order-wrapper">
            {/* COLLAPSED CARD */}
            <div className="order-card compact">
              <img
                className="order-thumb"
                src={getProductImage(firstItem)}
                alt={firstItem.title}
              />

              <div className="order-summary">
                <p className="order-title">
                  {firstItem.title}
                  {order.items.length > 1 && (
                    <span className="more-items">
                      {" "}+{order.items.length - 1} more
                    </span>
                  )}
                </p>

                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-meta">
                <p className="order-price">₹{total}</p>
                <button
                  className="arrow-btn"
                  onClick={() =>
                    setOpenOrderId(openOrderId === order.id ? null : order.id)
                  }
                >
                  {openOrderId === order.id ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {/* EXPANDED DETAILS */}
            {openOrderId === order.id && (
              <div className="order-details expanded">
                <p className="detail-tracking">
                  Tracking ID:{" "}
                  <strong>
                    {order.trackingId || "Will be assigned soon"}
                  </strong>
                </p>

                {order.items.map(item => (
                  <div key={item.productId} className="detail-row">
                    <div className="detail-left">
                      <p className="detail-name">{item.title}</p>
                      <p className="detail-qty">
                        Qty: {item.quantity || 1}
                      </p>
                      <p className="detail-status info">
                        Status: {order.status}
                      </p>

                      {order.status === "Delivered" && (
                        hasReviewed(item.productId) ? (
                          <span className="reviewed-badge">
                            Reviewed ✓
                          </span>
                        ) : (
                          <button
                            className="review-btn"
                            onClick={() => setReviewProduct(item)}
                          >
                            Write Review
                          </button>
                        )
                      )}
                    </div>

                    <p className="detail-price">
                      ₹{item.price * (item.quantity || 1)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* REVIEW MODAL */}
      {reviewProduct && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <h3>Review {reviewProduct.title}</h3>

            <div className="stars">
              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  className={n <= rating ? "star active" : "star"}
                  onClick={() => setRating(n)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Write your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="review-actions">
              <button
                disabled={rating === 0 || comment.trim() === ""}
                onClick={submitReview}
              >
                Submit Review
              </button>
              <button
                className="cancel"
                onClick={() => setReviewProduct(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
