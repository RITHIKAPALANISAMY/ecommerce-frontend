import { useEffect, useState } from "react";

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const allReviews =
      JSON.parse(localStorage.getItem("reviews")) || [];

    const productReviews = allReviews.filter(
      (r) => r.productId === productId
    );

    setReviews(productReviews);
  }, [productId]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "No ratings yet";

  return (
    <div
      id="reviews"
      className="mx-auto mt-10 max-w-7xl rounded-2xl bg-white p-6 shadow-sm"
    >
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">
          Customer Reviews
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">
            {averageRating}
          </span>
          <span>({reviews.length} reviews)</span>
        </div>
      </div>

      {/* EMPTY */}
      {reviews.length === 0 && (
        <p className="text-sm text-gray-400">
          No reviews yet
        </p>
      )}

      {/* REVIEWS LIST */}
      <div className="space-y-5">
        {reviews.map((review, index) => {
          const displayName =
            review.buyerName ||
            review.username ||
            review.email ||
            "Verified Buyer";

          const initial =
            displayName.charAt(0).toUpperCase();

          return (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-gray-50/40 p-5 transition hover:shadow-md"
            >
              {/* USER */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 font-semibold text-red-600 shadow-sm">
                  {initial}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800">
                      {displayName}
                    </p>

                    {review.verified && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        ✔ Verified Buyer
                      </span>
                    )}
                  </div>

                  {review.date && (
                    <p className="text-xs text-gray-400">
                      Reviewed on {review.date}
                    </p>
                  )}
                </div>
              </div>

              {/* RATING */}
              <div className="mb-2 flex items-center gap-1 text-yellow-500">
                {"★".repeat(review.rating)}
                <span className="ml-1 text-sm text-gray-500">
                  ({review.rating}.0)
                </span>
              </div>

              {/* COMMENT */}
              <p className="text-gray-700 leading-relaxed">
                {review.comment}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
