import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  BarChart3,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Package,
} from "lucide-react";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCompare } from "../../context/CompareContext";
import Reviews from "../../components/buyer/Reviews";

const PRODUCT_API = "http://localhost:8082/api/products";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();
  const { compareItems, addToCompare, removeFromCompare } =
    useCompare();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${PRODUCT_API}/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <h2 className="p-10 text-center text-lg font-semibold">
        Product not found
      </h2>
    );
  }

  /* ================= CALCULATIONS ================= */

  const stock = product.stock ?? 0;
  const LOW_STOCK_LIMIT = 5;

  const stockStatus =
    stock === 0 ? "OUT" : stock <= LOW_STOCK_LIMIT ? "LOW" : "IN";

  const isCompared = compareItems.some(
    (item) => String(item.id) === String(product.id)
  );

  const discountPercent =
    product.mrp && product.price
      ? Math.round(
          ((product.mrp - product.price) / product.mrp) * 100
        )
      : 0;

  /* ================= HANDLERS ================= */

  const toggleWishlist = () => {
    if (!product?.id) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = () => {
    if (stock === 0) return;

    addToCart({
      ...product,
      quantity: qty,
    });
  };

  const handleBuyNow = () => {
    if (stock === 0) return;

    addToCart({
      ...product,
      quantity: qty,
      buyNow: true,
    });

    navigate("/cart");
  };

  /* ================= UI ================= */

  return (
    <div className="bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

          {/* IMAGE SECTION */}
          <div>
            <div className="relative flex h-[420px] items-center justify-center rounded-xl bg-gray-100">

              {/* Discount Badge */}
              {discountPercent > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                  {discountPercent}% OFF
                </span>
              )}

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
                  className={`h-16 w-16 rounded-lg border p-1 ${
                    i === activeImg
                      ? "border-red-500 ring-2 ring-red-200"
                      : "border-gray-200"
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

            <h1 className="mt-1 text-2xl font-semibold text-gray-900">
              {product.title}
            </h1>

            {/* PRICE */}
            <div className="mt-4 flex items-end gap-3">
              <span className="text-3xl font-bold text-red-600">
                ₹{product.price}
              </span>

              {product.mrp && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.mrp}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-sm font-semibold text-green-600">
                      {discountPercent}% off
                    </span>
                  )}
                </>
              )}
            </div>

            {/* STOCK */}
            <div className="mt-3 text-sm font-medium">
              <span
                className={
                  stockStatus === "OUT"
                    ? "text-red-600"
                    : stockStatus === "LOW"
                    ? "text-orange-500"
                    : "text-green-600"
                }
              >
                {stockStatus === "OUT" && "Out of stock"}
                {stockStatus === "LOW" && `Only ${stock} left`}
                {stockStatus === "IN" && "In stock"}
              </span>
            </div>

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
                    qty < stock && setQty(qty + 1)
                  }
                  disabled={stock === 0}
                  className="h-8 w-8 rounded border disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white disabled:opacity-50"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={stock === 0}
                className="flex-1 rounded-xl border py-3 font-semibold disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* TRUST BADGES */}
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Truck size={16} /> Free Delivery
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw size={16} /> 7 Days Return
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} /> Genuine Product
              </li>
              <li className="flex items-center gap-2">
                <Package size={16} /> Secure Packaging
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* DESCRIPTION SECTION */}
      <div className="mx-auto mt-10 max-w-7xl rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Product Details
        </h2>

        {product.description?.about && (
          <p className="mb-6 text-gray-600 leading-relaxed">
            {product.description.about}
          </p>
        )}

        {product.description?.highlights?.length > 0 && (
          <ul className="mb-6 list-disc space-y-2 pl-5 text-gray-600">
            {product.description.highlights.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm text-gray-600">
          {product.description?.material && (
            <div>
              <strong>Material:</strong>{" "}
              {product.description.material}
            </div>
          )}

          {product.description?.usage && (
            <div>
              <strong>Usage:</strong>{" "}
              {product.description.usage}
            </div>
          )}

          {product.description?.care && (
            <div>
              <strong>Care:</strong>{" "}
              {product.description.care}
            </div>
          )}

          {product.description?.warranty && (
            <div>
              <strong>Warranty:</strong>{" "}
              {product.description.warranty}
            </div>
          )}

          {product.description?.expiryDate && (
            <div>
              <strong>Expiry Date:</strong>{" "}
              {product.description.expiryDate}
            </div>
          )}
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mx-auto mt-10 max-w-7xl">
        <Reviews productId={product.id} />
      </div>
    </div>
  );
}
