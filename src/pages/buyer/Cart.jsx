import { motion } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Tag,
  Truck,
  Receipt,
} from "lucide-react";

import CartItem from "../../components/buyer/CartItem";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Cart() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState("");

  /* ================= AUTH PROTECTION ================= */
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  /* ================= FETCH COUPONS ================= */
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/api/coupons");
        setAvailableCoupons(res.data || []);
      } catch {
        setAvailableCoupons([]);
      }
    };
    fetchCoupons();
  }, []);

  /* ================= STOCK FILTER ================= */
  const inStockItems = useMemo(
    () => cartItems.filter((i) => i.stock > 0),
    [cartItems]
  );

  const outOfStockItems = useMemo(
    () => cartItems.filter((i) => i.stock === 0),
    [cartItems]
  );

  /* ================= SAFE MONEY CALCULATION ================= */
  const subtotal = useMemo(() => {
    return inStockItems.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0);
  }, [inStockItems]);

  const shipping =
  subtotal >= 799
    ? 0
    : subtotal > 0
    ? 99
    : 0;

  // GST 18%
  const gst = Number((subtotal * 0.18).toFixed(2));

  let discount = 0;

  if (appliedCoupon) {
    discount = Number(
      ((subtotal * appliedCoupon.discountPercentage) / 100).toFixed(2)
    );
  }

  const total = Number(
    (subtotal + gst + shipping - discount).toFixed(2)
  );

  /* ================= APPLY COUPON ================= */
  const handleApply = async (code) => {
    try {
      const res = await api.get(
        `/api/coupons/validate/${code}?amount=${subtotal}`
      );
      setAppliedCoupon(res.data);
      setError("");
    } catch (err) {
      setAppliedCoupon(null);
      setError(
        err.response?.data?.message || "Coupon not valid"
      );
    }
  };

  /* ================= CHECKOUT ================= */
  const handleCheckout = () => {
    if (inStockItems.length === 0) return;

    localStorage.setItem(
      "checkoutAmount",
      JSON.stringify({
        subtotal,
        gst,
        shipping,
        discount,
        total,
        coupon: appliedCoupon,
      })
    );

    localStorage.setItem(
      "checkoutItems",
      JSON.stringify(inStockItems)
    );

    navigate("/checkout/address");
  };

  /* ================= EMPTY STATE ================= */
  if (!loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <ShoppingBag size={70} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-4">
          Your cart is empty
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-red-700 to-red-900 text-white px-6 py-3 rounded-xl shadow-md"
        >
          Continue Shopping
        </motion.button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 py-10">
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-8 max-w-6xl text-2xl font-bold text-gray-800"
      >
        Shopping Cart ({cartItems.length} items)
      </motion.h2>

      {outOfStockItems.length > 0 && (
        <div className="mx-auto mb-6 max-w-6xl rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Some items are currently out of stock.
        </div>
      )}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* CLEAR CART BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (window.confirm("Clear entire cart?")) {
                clearCart();
              }
            }}
            className="flex items-center gap-2 text-sm font-medium text-red-600 
                       border border-red-200 px-4 py-2 rounded-lg w-fit
                       hover:bg-red-600 hover:text-white transition-all duration-300"
          >
            <Trash2 size={16} />
            Clear Cart
          </motion.button>

          {/* COUPON SECTION */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h4 className="mb-4 font-semibold text-gray-800 flex items-center gap-2">
              <Tag size={18} /> Available Coupons
            </h4>

            {availableCoupons.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No active coupons available
              </p>
            ) : (
              availableCoupons.map((c) => (
                <div
                  key={c.id}
                  className="mb-3 flex items-center justify-between rounded-lg border border-dashed border-red-600 bg-red-50/30 p-3"
                >
                  <div>
                    <strong className="text-red-700">
                      {c.code}
                    </strong>
                    <p className="text-sm text-gray-600">
                      {c.discountPercentage}% OFF
                    </p>
                  </div>

                  <button
                    onClick={() => handleApply(c.code)}
                    className="rounded-md bg-red-700 px-4 py-1.5 text-sm text-white hover:bg-red-800"
                  >
                    Apply
                  </button>
                </div>
              ))
            )}

            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}

            {appliedCoupon && (
              <p className="mt-2 text-sm text-green-600 font-medium">
                Coupon "{appliedCoupon.code}" applied successfully
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="h-fit rounded-2xl bg-white p-6 shadow-xl">
          <h4 className="mb-4 font-semibold text-gray-800 flex items-center gap-2">
            <Receipt size={18} /> Price Details
          </h4>

          <div className="my-2 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="my-2 flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Truck size={14} /> Shipping
            </span>
            {shipping === 0 ? (
  <span className="text-green-600 font-medium">
    FREE
  </span>
) : (
  <span>₹{shipping.toFixed(2)}</span>
)}
          </div>

          <div className="my-2 flex justify-between text-sm">
            <span>GST (18%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          {subtotal >= 799 && (
  <p className="text-sm text-green-600 font-medium mt-2">
    🎉 You got FREE Delivery!
  </p>
)}

          {discount > 0 && (
            <div className="my-2 flex justify-between text-sm font-medium text-green-600">
              <span>Discount</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}

          <hr className="my-4" />

          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={inStockItems.length === 0}
            onClick={handleCheckout}
            className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white ${
              inStockItems.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-700 to-red-900 hover:opacity-90"
            }`}
          >
            Proceed to Checkout →
          </motion.button>
        </div>
      </div>
    </div>
  );
}