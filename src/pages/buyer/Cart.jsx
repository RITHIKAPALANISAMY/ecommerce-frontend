import CartItem from "../../components/buyer/CartItem";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Cart() {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ================= ROLE SAFE CHECK ================= */
  const isBuyer = user?.roles
    ?.map((r) => r.toUpperCase())
    .includes("BUYER");

  /* ================= PROTECTION ================= */
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  /* ================= BUY NOW LOGIC ================= */
  const buyNowItems = cartItems.filter((item) => item.buyNow === true);
  const itemsToShow =
    buyNowItems.length > 0 ? buyNowItems : cartItems;

  /* ================= COUPON STATE ================= */
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState("");

  /* ================= FETCH ACTIVE COUPONS ================= */
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/api/coupons");
        setAvailableCoupons(res.data || []);
      } catch (err) {
        console.log("No coupons available");
      }
    };

    fetchCoupons();
  }, []);

  /* ================= STOCK FILTER ================= */
  const inStockItems = useMemo(
    () =>
      itemsToShow.filter(
        (i) => i.stock === undefined || i.stock > 0
      ),
    [itemsToShow]
  );

  const outOfStockItems = useMemo(
    () =>
      itemsToShow.filter(
        (i) => i.stock !== undefined && i.stock === 0
      ),
    [itemsToShow]
  );

  /* ================= CALCULATIONS ================= */
  const subtotal = inStockItems.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.quantity),
    0
  );

  const shipping = subtotal > 0 ? 99 : 0;
  const gst = Math.round(subtotal * 0.18);

  let discount = 0;

  if (appliedCoupon) {
    discount = Math.round(
      subtotal * (appliedCoupon.discountPercentage / 100)
    );
  }

  const total = subtotal + gst + shipping - discount;

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
        err.response?.data?.message ||
          "Coupon not valid"
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

  return (
    <div className="bg-gray-100 py-8 pb-16 min-h-screen">
      <h2 className="mx-auto mb-6 max-w-6xl text-xl font-semibold text-gray-800">
        Shopping Cart ({itemsToShow.length} items)
      </h2>

      {outOfStockItems.length > 0 && (
        <div className="mx-auto mb-5 max-w-6xl rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Some items are currently <strong>out of stock</strong>.
        </div>
      )}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {itemsToShow.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* AVAILABLE COUPONS */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h4 className="mb-4 font-semibold text-gray-800">
              Available Coupons
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
                      {c.minOrderAmount
                        ? ` on orders above ₹${c.minOrderAmount}`
                        : ""}
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

        {/* RIGHT SECTION */}
        <div className="h-fit rounded-xl bg-white p-6 shadow-md">
          <h4 className="mb-4 font-semibold text-gray-800">
            Price Details
          </h4>

          <div className="my-2 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="my-2 flex justify-between text-sm">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>

          <div className="my-2 flex justify-between text-sm">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>

          {discount > 0 && (
            <div className="my-2 flex justify-between text-sm font-medium text-green-600">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}

          <hr className="my-4" />

          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {/* PROCEED TO CHECKOUT */}
          {user && (
            <button
              disabled={inStockItems.length === 0}
              onClick={handleCheckout}
              className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white ${
                inStockItems.length === 0
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-red-800 hover:bg-red-900"
              }`}
            >
              Proceed to Checkout →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}