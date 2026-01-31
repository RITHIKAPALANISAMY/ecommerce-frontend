import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import RatingStars from "../../components/common/RatingStars"; // ⭐ ADDED
import Reviews from "../../components/buyer/Reviews";


export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products } = useProducts();
  const [reviewRefresh, setReviewRefresh] = useState(0);

  const { addToCart, setCartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();
  const { user } = useAuth();

  /* SCROLL TO TOP */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const product = products.find((p) => p.id === Number(id));
  if (!product) return <h2 className="p-10">Product not found</h2>;

  /* ================= STOCK ================= */
  const LOW_STOCK_LIMIT = 5;
  const stock = product.stock ?? null;
  const stockStatus =
    stock === 0 ? "OUT" : stock <= LOW_STOCK_LIMIT ? "LOW" : "IN";

  /* ================= STATE ================= */
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  /* ================= REVIEWS ================= */
  const allReviews = product.reviews || [];

  const orderReviews = useMemo(() => {
    const stored = JSON.parse(localStorage.getItem("reviews") || "[]");
    return stored
      .filter((r) => Number(r.productId) === Number(product.id))
      .map((r) => ({
        rating: r.rating,
        comment: r.comment,
        user: r.userEmail,
        date: new Date(r.createdAt).toLocaleDateString(),
        verified: true,
      }));
  }, [product.id,reviewRefresh]);

  const mergedReviews = useMemo(
    () => [...allReviews, ...orderReviews],
    [allReviews, orderReviews]
  );

  const reviews = useMemo(
    () => mergedReviews.filter((r) => r.verified === true),
    [mergedReviews]
  );

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    return (
      reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);
  const handleBuyNow = () => {
  const buyNowItem = {
    ...product,
    quantity: qty, // IMPORTANT
  };

  addToCart(buyNowItem); // use CartContext
  navigate("/checkout/address");
};

  /* ================= DESCRIPTION ================= */
  const desc = product.description || {};

  const specs = [
    { label: "Material", value: desc.material },
    { label: "Usage", value: desc.usage },
    { label: "Care Instructions", value: desc.care },
    { label: "Warranty", value: desc.warranty },
    { label: "Expiry Date", value: desc.expiryDate },
  ].filter((s) => s.value);

  /* ================= HANDLERS ================= */
  const handleAddToCart = () => addToCart({ ...product, qty });
 
  const toggleWishlist = () =>
    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);

  /* ================= UI ================= */
  return (
    <div className="bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-7xl rounded-xl bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

          {/* ================= IMAGE SECTION ================= */}
          <div>
            <div className="flex h-[420px] w-full items-center justify-center rounded-lg bg-gray-100">
              <img
                src={product.images?.[activeImg]}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="mt-4 flex gap-3">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex h-16 w-16 items-center justify-center rounded border ${
                    i === activeImg
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ================= INFO ================= */}
          <div>
            {product.brand && (
              <p className="mb-1 text-sm text-gray-500">
                {product.brand}
              </p>
            )}

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-semibold">
                {product.title}
              </h1>

              <button
                onClick={toggleWishlist}
                className="text-sm text-red-600"
              >
                {isInWishlist(product.id)
                  ? "❤️ Wishlisted"
                  : "🤍 Wishlist"}
              </button>
            </div>

            {/* RATING (⭐ STARS ADDED, NOTHING REMOVED) */}
            <div className="mt-3 flex items-center gap-3">
              <span className="rounded bg-green-600 px-2 py-0.5 text-sm text-white">
                {averageRating || "New"} ★
              </span>

              {averageRating && (
                <RatingStars rating={Math.round(averageRating)} />
              )}

              <span className="text-sm text-gray-600">
                {reviews.length} verified ratings
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-red-600">
                ₹{product.price}
              </span>
              {product.mrp && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
              {product.discount && (
                <span className="text-sm text-green-600">
                  {product.discount}% off
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Inclusive of all taxes
            </p>

            {/* QUANTITY */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  className="h-8 w-8 rounded border"
                >
                  −
                </button>

                <span>{qty}</span>

                <button
                  onClick={() =>
                    stock !== null &&
                    qty < stock &&
                    setQty(qty + 1)
                  }
                  disabled={stock === 0}
                  className="h-8 w-8 rounded border"
                >
                  +
                </button>

                {stock !== null && (
                  <span
                    className={`text-sm ${
                      stockStatus === "OUT"
                        ? "text-red-600"
                        : stockStatus === "LOW"
                        ? "text-orange-500"
                        : "text-green-600"
                    }`}
                  >
                    {stockStatus === "OUT" && "Out of stock"}
                    {stockStatus === "LOW" &&
                      `Only ${stock} left`}
                  </span>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 rounded bg-red-600 py-2 text-white hover:bg-red-700"
              >
                🛒 Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={stock === 0}
                className="flex-1 rounded border py-2"
              >
                Buy Now
              </button>
            </div>

            <ul className="mt-6 space-y-1 text-sm text-gray-600">
              <li>🚚 Free Delivery</li>
              <li>↩️ 7 Days Return</li>
              <li>🛡️ Genuine Product</li>
            </ul>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mx-auto mt-8 max-w-7xl rounded bg-white p-6 shadow">
        <h3 className="mb-3 text-lg font-semibold">
          About this product
        </h3>
        <p className="text-gray-700">
          {desc.about ||
            "Detailed product information will be provided by the seller soon."}
        </p>

        {desc.highlights?.length > 0 && (
          <>
            <h4 className="mt-6 font-medium">Highlights</h4>
            <ul className="mt-2 list-disc pl-5 text-gray-700">
              {desc.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </>
        )}

        {specs.length > 0 && (
          <>
            <h4 className="mt-6 font-medium">Specifications</h4>
            <div className="mt-2 space-y-1 text-gray-700">
              {specs.map((s, i) => (
                <p key={i}>
                  <strong>{s.label}:</strong> {s.value}
                </p>
              ))}
            </div>
          </>
        )}
      </div>

      {/* REVIEWS */}
      <div className="mx-auto mt-8 max-w-7xl rounded bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">
          Ratings & Reviews
        </h3>

        {reviews.length === 0 && (
          <p className="text-gray-500">
            No verified reviews yet.
          </p>
        )}

        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="rounded border p-4">
              <span className="rounded bg-green-600 px-2 py-0.5 text-sm text-white">
                {r.rating} ★
              </span>

              {/* ⭐ STARS FOR EACH REVIEW */}
              <RatingStars rating={r.rating} />

              <p className="mt-1 font-medium">{r.user}</p>
              <p className="mt-1 text-gray-700">{r.comment}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span>{r.date}</span>
                <span className="text-green-600">
                  ✔ Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
