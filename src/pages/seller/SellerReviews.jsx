import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const REVIEW_API = "http://localhost:8082/api/reviews";

export default function SellerReviews() {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH REVIEWS ================= */

  const fetchReviews = async () => {

    try {

      setLoading(true);

      const sellerEmail =
        localStorage.getItem("sellerEmail");

      const res = await axios.get(
        `${REVIEW_API}/seller/pending`,
        {
          params: {
            sellerEmail,
            page: 0,
            size: 20
          }
        }
      );

      setReviews(res.data.content || []);

    } catch (err) {

      console.error(
        "Seller review fetch error:",
        err
      );

    } finally {

      setLoading(false);

    }
  };

  /* ================= LOAD ON PAGE OPEN ================= */

  useEffect(() => {
    fetchReviews();
  }, []);
  /* ================= REPLY FUNCTION ================= */

  const replyToReview = async (reviewId) => {

    const { value: reply } = await Swal.fire({
      title: "Reply to Customer",
      input: "textarea",
      inputPlaceholder: "Write a professional response...",
      inputAttributes: {
        "aria-label": "Type your reply here"
      },
      showCancelButton: true,
      confirmButtonText: "Send Reply",
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value || value.trim().length < 5) {
          return "Reply must be at least 5 characters";
        }
      }
    });

    if (!reply) return;

    try {

      await axios.put(
        `${REVIEW_API}/${reviewId}/reply`,
        null,
        { params: { reply: reply.trim() } }
      );

      /* 🔄 Trigger product page refresh */
      window.dispatchEvent(new Event("reviewSubmitted"));

      Swal.fire({
        icon: "success",
        title: "Reply Sent!",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false
      });

      fetchReviews(); // refresh seller list

    } catch (err) {

      Swal.fire({
        icon: "error",
        title: "Failed to reply",
        text: err.response?.data || "Something went wrong"
      });
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Customer Reviews Awaiting Reply
        </h2>

        {loading && <p>Loading reviews...</p>}

        {reviews.length === 0 && !loading && (
          <p className="text-gray-500">
            No reviews awaiting reply.
          </p>
        )}

        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
            >

              {/* HEADER */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800">
                    {review.buyerEmail}
                  </p>

                  <p className="text-xs text-gray-400">
                    Product ID: {review.productId}
                  </p>

                  {review.reviewDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.reviewDate).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>

                <span className="text-yellow-500 text-lg">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>

              {/* REVIEW COMMENT */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                {review.comment}
              </p>

              {/* REPLY BUTTON */}
              <button
                onClick={() => replyToReview(review.id)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
              >
                Reply
              </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}