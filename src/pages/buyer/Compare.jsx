import { useEffect, useState, useMemo } from "react";
import productApi from "../../api/productApi";
import { useCompare } from "../../context/CompareContext";

export default function Compare() {
  const { compareItems } = useCompare();

  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState(null);
  const [error, setError] = useState(null);

  /* ================= MEMOIZED PRODUCT IDS ================= */
  const productIds = useMemo(
    () => compareItems.map((p) => p.id),
    [compareItems]
  );

  /* ================= FETCH COMPARISON ================= */
  useEffect(() => {
    if (productIds.length < 2) {
      setCompareData(null);
      return;
    }

    const fetchComparison = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await productApi.post(
          "/api/products/compare",
          { productIds }
        );

        setCompareData(response.data);
      } catch (err) {
        console.error("Compare error:", err);
        setError("Failed to load comparison. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [productIds]);

  /* ================= UI STATES ================= */

  if (compareItems.length < 2) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold">
          Add at least 2 products to compare
        </h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-lg font-medium">
        Loading comparison...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-600 font-medium">
        {error}
      </div>
    );
  }

  if (!compareData) return null;

  const { comparedProducts = [], bestProduct, reason } = compareData;

  /* ================= SAFE CALCULATIONS ================= */
  const cheapestPrice = Math.min(
    ...comparedProducts.map((p) => p.price ?? Infinity)
  );

  const highestRating = Math.max(
    ...comparedProducts.map((p) => p.rating ?? 0)
  );

  const highestReviews = Math.max(
    ...comparedProducts.map((p) => p.reviewCount ?? 0)
  );

  return (
    <div className="bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-7xl rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-8 text-center text-3xl font-bold">
          Compare Products
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full border-collapse">

            {/* HEADER */}
            <thead>
              <tr>
                <th className="border p-4 text-left bg-gray-50">
                  Feature
                </th>

                {comparedProducts.map((p) => (
                  <th
                    key={p.id}
                    className={`border p-4 text-center ${
                      p.id === bestProduct?.id
                        ? "bg-green-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">

                      <img
                        src={p.images?.[0] || "/placeholder.png"}
                        alt={p.title}
                        className="h-32 object-contain"
                      />

                      <div className="font-semibold text-sm">
                        {p.title}
                      </div>

                      {p.id === bestProduct?.id && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          🏆 Best Overall
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>

              {/* PRICE */}
              <tr>
                <td className="border p-4 font-semibold">Price</td>

                {comparedProducts.map((p) => {
                  const price = p.price ?? 0;
                  const diff = price - cheapestPrice;

                  return (
                    <td
                      key={p.id}
                      className={`border p-4 text-center font-bold ${
                        price === cheapestPrice
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      ₹{price}

                      {price === cheapestPrice && (
                        <div className="text-xs text-green-600 font-medium">
                          Best Price
                        </div>
                      )}

                      {diff > 0 && (
                        <div className="text-xs text-red-500">
                          ₹{diff.toFixed(0)} more
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* RATING */}
              <tr>
                <td className="border p-4 font-semibold">Rating</td>

                {comparedProducts.map((p) => {
                  const rating = p.rating ?? 0;

                  return (
                    <td
                      key={p.id}
                      className={`border p-4 text-center ${
                        rating === highestRating
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      ⭐ {rating.toFixed(1)}

                      {rating === highestRating && rating > 0 && (
                        <div className="text-xs text-blue-600">
                          Highest Rated
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* REVIEWS */}
              <tr>
                <td className="border p-4 font-semibold">Reviews</td>

                {comparedProducts.map((p) => {
                  const reviewCount = p.reviewCount ?? 0;

                  return (
                    <td
                      key={p.id}
                      className={`border p-4 text-center ${
                        reviewCount === highestReviews
                          ? "bg-purple-50"
                          : ""
                      }`}
                    >
                      {reviewCount}

                      {reviewCount === highestReviews && reviewCount > 0 && (
                        <div className="text-xs text-purple-600">
                          Most Reviewed
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* STOCK */}
              <tr>
                <td className="border p-4 font-semibold">
                  Availability
                </td>

                {comparedProducts.map((p) => (
                  <td key={p.id} className="border p-4 text-center">
                    {p.stock > 0 ? (
                      <span className="text-green-600 font-medium">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* SMART SCORE */}
              <tr>
                <td className="border p-4 font-semibold">
                  Smart Score
                </td>

                {comparedProducts.map((p) => (
                  <td key={p.id} className="border p-4 text-center">
                    <div className="text-lg font-bold">
                      {p.score ?? 0}%
                    </div>

                    <div className="w-full bg-gray-200 rounded h-2 mt-2">
                      <div
                        className="bg-green-500 h-2 rounded"
                        style={{
                          width: `${p.score ?? 0}%`,
                        }}
                      />
                    </div>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

        {/* RECOMMENDATION */}
        <div className="mt-8 rounded-lg bg-green-50 p-6 border border-green-200">
          <h3 className="font-semibold text-green-700 text-lg">
            Why this product is recommended?
          </h3>
          <p className="text-gray-700 mt-3">
            {reason}
          </p>
        </div>

      </div>
    </div>
  );
}