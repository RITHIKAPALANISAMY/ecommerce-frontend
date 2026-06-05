import { useEffect, useState } from "react";
import axios from "axios";

const REVIEW_API = "http://localhost:8082/api/reviews";

export default function Reviews({ productId, refresh }) {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${REVIEW_API}/${productId}?page=0&size=10`
      );

      setReviews(res.data.content || []);
      setTotalReviews(res.data.totalElements || 0);

      const avgRes = await axios.get(
        `${REVIEW_API}/${productId}/average`
      );

      setAverage(avgRes.data || 0);

    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productId) return;
    fetchReviews();
  }, [productId, refresh]);

  /* ⭐ Render Stars Properly */
  const renderStars = (rating) => {
    const fullStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return fullStars + emptyStars;
  };

  /* 📅 Format Date */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        Customer Reviews
      </h3>

      {/* ⭐ Average Rating */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-yellow-500">
            {average.toFixed(1)}
          </span>
          <span className="text-yellow-500 text-xl">
            {renderStars(Math.round(average))}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
        </p>
      </div>

      {loading && <p>Loading...</p>}

      {reviews.length === 0 && !loading && (
        <p className="text-gray-400">
          No reviews yet
        </p>
      )}

      <div className="space-y-5">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-xl p-4 hover:shadow-sm transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">
                  {review.buyerEmail}
                </p>

                {review.verifiedPurchase && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mt-1 inline-block">
                    ✔ Verified Purchase
                  </span>
                )}
              </div>

              <span className="text-xs text-gray-400">
                {formatDate(review.reviewDate)}
              </span>
            </div>

            <div className="text-yellow-500 mt-2 text-lg">
              {renderStars(review.rating)}
            </div>

            <p className="mt-2 text-gray-700 leading-relaxed">
              {review.comment}
            </p>

            {review.sellerReply && (
              <div className="mt-3 bg-gray-100 p-3 rounded">
                <p className="text-sm font-semibold text-gray-700">
                  Seller Reply:
                </p>
                <p className="text-sm text-gray-600">
                  {review.sellerReply}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}