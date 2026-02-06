import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCompare } from "../../context/CompareContext";
import Reviews from "../../components/buyer/Reviews";
import { BarChart3 } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { compareItems, addToCompare, removeFromCompare } = useCompare();

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <h2 className="p-10 text-center text-lg font-semibold">
        Product not found
      </h2>
    );
  }

  const isCompared = compareItems.some(
    (item) => item.id === product.id
  );

  /* ================= REVIEWS ================= */
  const { averageRating, reviewCount } = useMemo(() => {
    const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const productReviews = allReviews.filter(
      (r) => r.productId === product.id
    );

    const count = productReviews.length;
    const avg =
      count > 0
        ? (
            productReviews.reduce((sum, r) => sum + r.rating, 0) / count
          ).toFixed(1)
        : null;

    return { averageRating: avg, reviewCount: count };
  }, [product.id]);

  /* ================= STOCK ================= */
  const LOW_STOCK_LIMIT = 5;
  const stock = product.stock ?? null;
  const stockStatus =
    stock === 0 ? "OUT" : stock <= LOW_STOCK_LIMIT ? "LOW" : "IN";

  const desc = product.description || {};

  const specs = [
    { label: "Material", value: desc.material },
    { label: "Usage", value: desc.usage },
    { label: "Care Instructions", value: desc.care },
    { label: "Warranty", value: desc.warranty },
    { label: "Expiry Date", value: desc.expiryDate },
  ].filter((s) => s.value);

  const handleAddToCart = () =>
    addToCart({ ...product, quantity: qty });

  const handleBuyNow = () => {
    addToCart({ ...product, quantity: qty, buyNow: true });
    navigate("/cart");
  };

  const toggleWishlist = () =>
    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);

  return (
    <div className="bg-gray-50 px-4 py-8">
      {/* ================= TOP CARD ================= */}
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

          {/* IMAGE SECTION */}
          <div>
            <div className="flex h-[420px] items-center justify-center rounded-xl bg-gray-100">
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
                  className={`h-16 w-16 rounded-lg border p-1 transition
                    ${
                      i === activeImg
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div>
            {product.brand && (
              <p className="text-sm uppercase tracking-wide text-gray-500">
                {product.brand}
              </p>
            )}

            {/* TITLE + ACTIONS */}
            <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                {product.title}
              </h1>

              <div className="flex items-center gap-3">
                {/* WISHLIST */}
                <button
                  onClick={toggleWishlist}
                  className={`rounded-full border p-2 transition
                    ${
                      isInWishlist(product.id)
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500"
                    }`}
                >
                  ❤️
                </button>

                {/* COMPARE */}
                <button
                  onClick={() =>
                    isCompared
                      ? removeFromCompare(product.id)
                      : addToCompare(product)
                  }
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition
                    ${
                      isCompared
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600"
                    }`}
                >
                  <BarChart3 size={16} />
                  {isCompared ? "Added to Compare" : "Add to Compare"}
                </button>
              </div>
            </div>

            {/* RATING */}
            {averageRating && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-yellow-500">
                  {"★".repeat(Math.round(averageRating))}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {averageRating}
                </span>
                <span className="text-sm text-gray-500">
                  ({reviewCount} reviews)
                </span>
              </div>
            )}

            {/* PRICE */}
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-bold text-red-600">
                ₹{product.price}
              </span>

              {product.mrp && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.mrp}
                </span>
              )}

              {product.discount && (
                <span className="rounded bg-green-100 px-2 py-0.5 text-sm font-medium text-green-700">
                  {product.discount}% OFF
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

                <span className="font-medium">{qty}</span>

                <button
                  onClick={() =>
                    stock !== null &&
                    qty < stock &&
                    setQty(qty + 1)
                  }
                  disabled={stock === 0}
                  className="h-8 w-8 rounded border disabled:cursor-not-allowed"
                >
                  +
                </button>

                {stock !== null && (
                  <span
                    className={`text-sm font-medium ${
                      stockStatus === "OUT"
                        ? "text-red-600"
                        : stockStatus === "LOW"
                        ? "text-orange-500"
                        : "text-green-600"
                    }`}
                  >
                    {stockStatus === "OUT" && "Out of stock"}
                    {stockStatus === "LOW" && `Only ${stock} left`}
                  </span>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={stock === 0}
                className="flex-1 rounded-xl border py-3 font-semibold hover:bg-gray-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* TRUST */}
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-600">
              <li>🚚 Free Delivery</li>
              <li>↩️ 7 Days Return</li>
              <li>🛡️ Genuine Product</li>
              <li>📦 Secure Packaging</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= ABOUT ================= */}
      <div className="mx-auto mt-10 max-w-7xl rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          About this product
        </h3>

        <p className="text-gray-700">
          {desc.about ||
            "Detailed product information will be provided by the seller soon."}
        </p>

        {desc.highlights?.length > 0 && (
          <>
            <h4 className="mt-6 font-medium text-gray-800">
              Highlights
            </h4>
            <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
              {desc.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </>
        )}

        {specs.length > 0 && (
          <>
            <h4 className="mt-6 font-medium text-gray-800">
              Specifications
            </h4>
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
      <div className="mx-auto mt-10 max-w-7xl">
        <Reviews productId={product.id} />
      </div>
    </div>
  );
}
