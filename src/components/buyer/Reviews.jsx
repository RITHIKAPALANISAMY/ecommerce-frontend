import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";

/* ================= SAVE REVIEW (LOCAL STORAGE) ================= */
const saveReview = ({ orderId, productId, rating, comment, userEmail }) => {
  const existing = JSON.parse(localStorage.getItem("reviews")) || [];

  const newReview = {
    id: Date.now(),
    orderId,
    productId,
    rating,
    comment,
    userEmail,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(
    "reviews",
    JSON.stringify([newReview, ...existing])
  );
};

export default function Reviews({ productId }) {
  const { user } = useAuth();
  const { orders } = useOrders();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /* ================= LOAD ALL REVIEWS ================= */
  const allReviews = useMemo(() => {
    return JSON.parse(localStorage.getItem("reviews") || "[]");
  }, []);

  /* ================= PRODUCT REVIEWS ================= */
  const productReviews = useMemo(() => {
    return allReviews.filter(r => r.productId === productId);
  }, [allReviews, productId]);

  /* ================= FIND ELIGIBLE ORDER ================= */
  const eligibleOrder = useMemo(() => {
    if (!user) return null;

    return orders.find(order => {
      // ✅ status check (case-safe)
      if (order.status?.toLowerCase() !== "delivered") return false;

      // ✅ correct buyer check
      if (order.buyerId !== user.id) return false;

      // ✅ product exists in order
      const hasProduct = order.items.some(
        item => item.productId === productId
      );

      // ✅ prevent duplicate review per order
      const alreadyReviewed = allReviews.some(
        r =>
          r.orderId === order.id &&
          r.productId === productId &&
          r.userEmail === user.email
      );

      return hasProduct && !alreadyReviewed;
    });
  }, [orders, user, productId, allReviews]);

  /* ================= LOGIN CHECK ================= */
  if (!user) {
    return (
      <p className="mt-6 text-sm text-gray-500">
        Login to write a review.
      </p>
    );
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (!rating || !comment.trim()) {
      alert("Please give rating and comment");
      return;
    }

    saveReview({
      orderId: eligibleOrder.id,
      productId,
      rating,
      comment,
      userEmail: user.email,
    });

    setSubmitted(true);
    setRating(0);
    setComment("");
  };

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow">
      {/* ================= EXISTING REVIEWS ================= */}
      <h3 className="mb-4 text-lg font-semibold">
        Customer Reviews
      </h3>

      {productReviews.length === 0 ? (
        <p className="mb-6 text-sm text-gray-500">
          No verified reviews yet.
        </p>
      ) : (
        <div className="mb-6 space-y-4">
          {productReviews.map(r => (
            <div key={r.id} className="border-b pb-3">
              <p className="text-sm font-medium">{r.userEmail}</p>
              <p className="text-yellow-500">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </p>
              <p className="text-sm text-gray-700">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* ================= REVIEW FORM ================= */}
      {!eligibleOrder ? (
        <p className="text-sm text-gray-500">
          You can review this product only after it is delivered
          and only once per order.
        </p>
      ) : (
        <>
          <h3 className="mb-4 text-lg font-semibold">
            Write a Review
          </h3>

          {submitted && (
            <p className="mb-3 text-sm text-green-600">
              ✅ Review submitted successfully
            </p>
          )}

          {/* ⭐ RATING */}
          <div className="mb-4 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`text-2xl ${
                  n <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* COMMENT */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Write your review here..."
            className="w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-red-500"
          />

          {/* ACTION */}
          <button
            onClick={handleSubmit}
            className="mt-4 rounded-lg bg-red-600 px-6 py-2 text-sm text-white hover:bg-red-700"
          >
            Submit Review
          </button>
        </>
      )}
    </div>
  );
}
