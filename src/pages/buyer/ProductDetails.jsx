import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCompare } from "../../context/CompareContext";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Package,
} from "lucide-react";
import { Heart, GitCompare } from "lucide-react";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import Reviews from "../../components/buyer/Reviews";
import { motion } from "framer-motion";


const PRODUCT_API = "http://localhost:8082/api/products";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [refreshReviews, setRefreshReviews] = useState(false);
  const { addToCompare, compareItems } = useCompare();

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
  const handleStorageChange = () => {
    setRefreshReviews(prev => !prev);
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${PRODUCT_API}/view/${id}`);
        setProduct(res.data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        Loading product...
      </div>
    );

  if (!product)
    return (
      <div className="p-10 text-center text-gray-500">
        Product not found
      </div>
    );

  const stock = product.stock ?? 0;

  const discountPercent =
    product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  /* ================= HANDLERS ================= */

  const handleAddToCart = async () => {
    if (stock === 0) return;
    await addToCart({ id: product.id, quantity: qty });
  };

  const handleBuyNow = async () => {
    if (stock === 0) return;
    await addToCart({ id: product.id, quantity: qty });
    navigate("/cart");
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

 const handleCompare = () => {
  if (!product) return;

  addToCompare(product);
};
  /* ================= UI ================= */

  return (
    <div className="bg-gradient-to-br from-gray-50 to-red-50 px-4 py-10">

      {/* ================= MAIN CARD ================= */}
      <div className="mx-auto max-w-7xl rounded-3xl bg-white shadow-xl p-8">
        <div className="grid gap-12 md:grid-cols-2">

          {/* ================= IMAGE SECTION ================= */}
          <div>
            <div className="relative h-[420px] flex items-center justify-center rounded-2xl bg-gray-100 overflow-hidden">

              {/* Wishlist & Compare */}
              <div className="absolute top-4 right-4 flex gap-3 z-10">
                <button
                  onClick={handleWishlist}
                  className={`p-2 rounded-full shadow-md transition ${
                    isInWishlist(product.id)
                      ? "bg-red-100"
                      : "bg-white hover:bg-red-50"
                  }`}
                >
                  <Heart
                    size={18}
                    className={
                      isInWishlist(product.id)
                        ? "text-red-600 fill-red-600"
                        : "text-red-500"
                    }
                  />
                </button>

                <button
  onClick={handleCompare}
  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
>
  <GitCompare size={18} className="text-gray-700" />
</button>
              </div>

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                  {discountPercent}% OFF
                </span>
              )}

              <motion.img
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images?.[activeImg] || "/placeholder.png"}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="mt-5 flex gap-3">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 rounded-xl border transition ${
                    i === activeImg
                      ? "border-red-500 ring-2 ring-red-200"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ================= DETAILS ================= */}
          <div className="flex flex-col">

            {product.brand && (
              <p className="text-sm uppercase tracking-wide text-gray-500">
                {product.brand}
              </p>
            )}

            <h1 className="mt-2 text-2xl font-bold text-gray-900 leading-snug">
              {product.title}
            </h1>

            {/* PRICE */}
            <div className="mt-6 flex items-end gap-4">
              <span className="text-3xl font-bold text-red-600">
                ₹{product.price}
              </span>

              {product.mrp && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>

            {/* STOCK */}
            <div className="mt-3 text-sm font-medium">
              {stock === 0 ? (
                <span className="text-red-600">Out of stock</span>
              ) : stock <= 5 ? (
                <span className="text-orange-500">
                  Only {stock} left
                </span>
              ) : (
                <span className="text-green-600">In stock</span>
              )}
            </div>

            {/* QUANTITY */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  className="h-9 w-9 rounded-lg border hover:bg-gray-100"
                >
                  −
                </button>

                <span className="text-lg font-semibold">{qty}</span>

                <button
                  onClick={() => qty < stock && setQty(qty + 1)}
                  className="h-9 w-9 rounded-lg border hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white shadow-md hover:bg-red-700 disabled:opacity-50"
              >
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBuyNow}
                disabled={stock === 0}
                className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold hover:bg-gray-100 disabled:opacity-50"
              >
                Buy Now
              </motion.button>
            </div>

            {/* TRUST BADGES */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                <Truck size={16} /> Free Delivery
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                <RotateCcw size={16} /> 7 Days Return
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                <ShieldCheck size={16} /> Genuine Product
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                <Package size={16} /> Secure Packaging
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mx-auto mt-12 max-w-7xl rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="text-xl font-bold mb-6">
          Product Details
        </h2>

        {product.description?.about && (
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description.about}
          </p>
        )}

        {product.description?.highlights?.length > 0 && (
          <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
            {product.description.highlights.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      {/* REVIEWS */}
      <div className="mx-auto mt-12 max-w-7xl">
        <Reviews
          productId={product.id}
          refresh={refreshReviews}
        />
      </div>
    </div>
  );
}