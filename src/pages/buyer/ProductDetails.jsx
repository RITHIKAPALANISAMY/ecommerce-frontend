import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import Reviews from "../../components/buyer/Reviews";
import { useCompare } from "../../context/CompareContext";
import { BarChart3 } from "lucide-react";


export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const product = products.find(
    (p) => p.id === Number(id)
  );

  if (!product)
    return (
      <h2 className="p-10 text-center text-lg font-semibold">
        Product not found
      </h2>
    );
    const { compareItems, addToCompare, removeFromCompare } = useCompare();

const isCompared = compareItems.some(
  (item) => item.id === product.id
);


  const { averageRating, reviewCount } = useMemo(() => {
    const allReviews =
      JSON.parse(localStorage.getItem("reviews")) || [];

    const productReviews = allReviews.filter(
      (r) => r.productId === product.id
    );

    const count = productReviews.length;

    const avg =
      count > 0
        ? (
            productReviews.reduce(
              (sum, r) => sum + r.rating,
              0
            ) / count
          ).toFixed(1)
        : null;

    return {
      averageRating: avg,
      reviewCount: count,
    };
  }, [product.id]);

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
    addToCart({
      ...product,
      quantity: qty,
      buyNow: true,
    });
    navigate("/cart");
  };

  const toggleWishlist = () =>
    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);

  return (
    <div className="bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

          {/* IMAGE SECTION */}
          <div>
            <div className="flex h-[420px] items-center justify-center rounded-xl bg-gray-100">
              <img
                src={product.images?.[activeImg]}
                alt={product.title}
                className="max-h-full max-w-full object-contain transition"
              />
            </div>

            <div className="mt-4 flex gap-3">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex h-16 w-16 items-center justify-center rounded-lg border transition ${
                    i === activeImg
                      ? "border-red-500 ring-2 ring-red-200"
                      : "border-gray-200 hover:border-gray-400"
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

          {/* DETAILS SECTION */}
          <div>
            {product.brand && (
              <p className="mb-1 text-sm uppercase tracking-wide text-gray-500">
                {product.brand}
              </p>
            )}

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                {product.title}
              </h1>

              <div className="flex items-center gap-4">
  <button
    onClick={toggleWishlist}
    className="text-sm font-medium text-red-600 transition hover:underline"
  >
    {isInWishlist(product.id) ? "❤️ Wishlisted" : "🤍 Wishlist"}
  </button>

  <button
    onClick={() =>
      isCompared
        ? removeFromCompare(product.id)
        : addToCompare(product)
    }
    className={`flex items-center gap-1 text-sm font-medium transition
      ${
        isCompared
          ? "text-blue-600"
          : "text-gray-600 hover:text-blue-600"
      }`}
  >
    <BarChart3 size={16} />
    {isCompared ? "Added to Compare" : "Add to Compare"}
  </button>
</div>

              
            </div>

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

            <div className="mt-3 flex items-center gap-3">
              <span className="text-2xl font-bold text-red-600">
                ₹{product.price}
              </span>

              {product.mrp && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.mrp}
                </span>
              )}

              {product.discount && (
                <span className="text-sm font-medium text-green-600">
                  {product.discount}% off
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Inclusive of all taxes
            </p>

            {/* QUANTITY */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  className="h-8 w-8 rounded-md border text-lg transition hover:bg-gray-100"
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
                  className="h-8 w-8 rounded-md border text-lg transition hover:bg-gray-100 disabled:cursor-not-allowed"
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
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-lg bg-red-600 py-2.5 font-semibold text-white transition hover:bg-red-700 hover:shadow"
              >
                🛒 Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={stock === 0}
                className="flex-1 rounded-lg border py-2.5 font-semibold transition hover:bg-gray-50 disabled:cursor-not-allowed"
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

      {/* ABOUT */}
      <div className="mx-auto mt-10 max-w-7xl rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          About this product
        </h3>

        <p className="text-gray-700 leading-relaxed">
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

      <div className="mx-auto mt-10 max-w-7xl">
        <Reviews productId={product.id} />
      </div>
    </div>
  );
}
