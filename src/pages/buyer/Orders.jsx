import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const ORDER_API = "http://localhost:8085/api/orders";
const REVIEW_API = "http://localhost:8082/api/reviews";

export default function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [reviewedProducts, setReviewedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ORDERS ================= */

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${ORDER_API}/buyer/${user.email.toLowerCase()}`
        );
        setOrders(res.data || []);
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  /* ================= FETCH USER REVIEWS ================= */

  useEffect(() => {
    if (!user?.email) return;

    const fetchUserReviews = async () => {
      try {
        const res = await axios.get(
          `${REVIEW_API}/buyer/${user.email}`
        );

        const productIds = res.data.map(r => r.productId);
        setReviewedProducts(productIds);
      } catch (err) {
        console.error("Review fetch error:", err);
      }
    };

    fetchUserReviews();
  }, [user]);

  /* ================= WRITE REVIEW ================= */

  const writeReview = async (productId) => {

    const { value: formValues } = await Swal.fire({
      title: "Share Your Experience ⭐",
      html: `
        <div style="text-align:left">
          <label style="font-weight:600">Rating</label>
          <select id="rating" class="swal2-input">
            <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
            <option value="4">⭐⭐⭐⭐ - Very Good</option>
            <option value="3">⭐⭐⭐ - Good</option>
            <option value="2">⭐⭐ - Fair</option>
            <option value="1">⭐ - Poor</option>
          </select>
          <label style="font-weight:600">Your Review</label>
          <textarea id="comment" class="swal2-textarea" placeholder="Tell others what you liked or disliked..."></textarea>
        </div>
      `,
      confirmButtonText: "Submit Review",
      confirmButtonColor: "#4f46e5",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      focusConfirm: false,
      preConfirm: () => {
        const rating = document.getElementById("rating").value;
        const comment = document.getElementById("comment").value;

        if (!comment || comment.trim().length < 5) {
          Swal.showValidationMessage("Review must be at least 5 characters");
          return false;
        }

        return { rating, comment };
      },
    });

    if (!formValues) return;

    try {
      await axios.post(REVIEW_API, {
        productId,
        buyerEmail: user.email,
        rating: parseInt(formValues.rating),
        comment: formValues.comment.trim(),
      });

      /* ✅ Trigger product page refresh */
      window.dispatchEvent(new Event("reviewSubmitted"));

      /* ✅ Premium Success Toast */
      Swal.fire({
        icon: "success",
        title: "Thank You! 💛",
        text: "Your review has been submitted successfully.",
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        background: "#f0fdf4",
        color: "#166534",
      });

      setReviewedProducts(prev => [...prev, productId]);

    } catch (err) {

      console.error("Review error:", err.response?.data);

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err.response?.data || "Something went wrong. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        <h2 className="mb-8 text-3xl font-bold text-gray-800">
          My Orders
        </h2>

        {loading && <p>Loading...</p>}

        {orders.map((order) => (
          <div
            key={order.id}
            className="mb-6 rounded-2xl bg-white p-6 shadow-md"
          >

            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold text-lg">
                Order #{order.id}
              </p>
              <StatusBadge status={order.status} />
            </div>

            {order.items.map((item) => {

              const alreadyReviewed =
                reviewedProducts.includes(item.productId);

              return (
                <div
                  key={item.productId}
                  className="flex justify-between items-center border-t pt-4"
                >
                  <div>
                    <p className="font-medium">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {order.status === "DELIVERED" && (
                    alreadyReviewed ? (
                      <span className="text-green-600 font-semibold text-sm">
                        ✔ Reviewed
                      </span>
                    ) : (
                      <button
                        onClick={() => writeReview(item.productId)}
                        className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
                      >
                        Write Review
                      </button>
                    )
                  )}
                </div>
              );
            })}

          </div>
        ))}

      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    PLACED: "bg-yellow-100 text-yellow-700",
    SHIPPED: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}