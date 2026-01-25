import "../../styles/orders.css";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useState } from "react";

export default function Orders() {
  const orders =
    JSON.parse(localStorage.getItem("orders")) || [];

  const { user } = useAuth();
  const { addReview, products } = useProducts();

  const [activeReview, setActiveReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const hasReviewed = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product?.reviews.some(
      (r) => r.user === user.email
    );
  };

  const submitReview = () => {
    if (!activeReview) return;

    addReview(activeReview.productId, {
      user: user.email,
      rating,
      comment,
    });

    setActiveReview(null);
    setRating(5);
    setComment("");
  };

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>

          {order.items.map((item) => (
            <div key={item.productId} className="order-item">
              <p>{item.title}</p>

              {order.status === "Delivered" &&
                !hasReviewed(item.productId) && (
                  <button
                    onClick={() =>
                      setActiveReview({
                        productId: item.productId,
                      })
                    }
                  >
                    ✍ Write Review
                  </button>
                )}

              {hasReviewed(item.productId) && (
                <span style={{ color: "green" }}>
                  ✔ Reviewed
                </span>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* REVIEW MODAL */}
      {activeReview && (
        <div className="review-modal">
          <h3>Write Review</h3>

          {/* ⭐ STAR RATING */}
          <div className="stars">
            {[1,2,3,4,5].map((s) => (
              <span
                key={s}
                onClick={() => setRating(s)}
                style={{
                  cursor: "pointer",
                  fontSize: "22px",
                  color: s <= rating ? "#facc15" : "#ccc",
                }}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Your feedback"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="review-actions">
            <button onClick={submitReview}>
              Submit
            </button>
            <button
              onClick={() => setActiveReview(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
