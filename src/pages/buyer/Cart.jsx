import CartItem from "../../components/buyer/CartItem";
import { useCart } from "../../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Cart() {
  const {
    cartItems,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= AUTH & ROLE GUARD ================= */
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  /* ================= BUY NOW ================= */
  const buyNowItem = location.state?.buyNowItem;
  const itemsToShow = buyNowItem
    ? [{ ...buyNowItem, qty: buyNowItem.qty || 1 }]
    : cartItems;

  const [couponInput, setCouponInput] = useState("");
  const [error, setError] = useState("");

  /* ================= STOCK SPLIT ================= */
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

  /* ================= PRICE CALC (ONLY IN STOCK) ================= */
  const subtotal = inStockItems.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.qty),
    0
  );

  const shipping = subtotal > 0 ? 99 : 0;
  const gst = Math.round(subtotal * 0.18);

  let discount = 0;
  if (appliedCoupon && subtotal > 0) {
    discount =
      appliedCoupon.type === "PERCENT"
        ? Math.round(subtotal * (appliedCoupon.value / 100))
        : appliedCoupon.value;
  }

  const total = subtotal + gst + shipping - discount;

  /* ================= APPLY COUPON ================= */
  const handleApply = () => {
    const msg = applyCoupon(couponInput.trim(), subtotal);
    setError(msg || "");
  };

  /* ================= CHECKOUT ================= */
  const handleCheckout = () => {
    if (inStockItems.length === 0) return;

    /* 🔑 SINGLE SOURCE OF TRUTH */
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

  const isBuyer = user?.role === "buyer";

  return (
    <div className="bg-gray-100 py-8 pb-16">
      <h2 className="mx-auto mb-5 max-w-6xl text-xl font-semibold">
        Shopping Cart ({itemsToShow.length} items)
      </h2>

      {outOfStockItems.length > 0 && (
        <div className="mx-auto mb-4 max-w-6xl rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
          Some items are currently <strong>out of stock</strong>.
          <br />
          They won’t be included in checkout.
        </div>
      )}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {itemsToShow.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* COUPONS */}
          <div className="rounded-xl bg-white p-4">
            <h4 className="mb-3 font-semibold">
              Available Coupons
            </h4>

            {[
              {
                code: "WELCOME10",
                desc: "10% OFF on orders above ₹500",
              },
              {
                code: "SAVE500",
                desc: "₹500 OFF on orders above ₹2000",
              },
            ].map((c) => (
              <div
                key={c.code}
                className="mb-3 flex items-center justify-between rounded-lg border border-dashed border-red-700 p-3"
              >
                <div>
                  <strong>{c.code}</strong>
                  <p className="text-sm text-gray-600">
                    {c.desc}
                  </p>
                </div>
                <button
                  onClick={() => setCouponInput(c.code)}
                  className="rounded-md bg-red-700 px-4 py-1.5 text-white"
                >
                  Apply
                </button>
              </div>
            ))}

            {appliedCoupon && (
              <button
                onClick={removeCoupon}
                className="text-sm text-red-600 underline"
              >
                Remove Coupon
              </button>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="h-fit rounded-xl bg-white p-5 shadow">
          <h4 className="mb-4 font-semibold">
            Price Details
          </h4>

          <div className="mb-4 flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 rounded-md border px-3 py-2"
            />
            <button
              onClick={handleApply}
              className="rounded-md bg-red-700 px-4 py-2 text-white"
            >
              Apply
            </button>
          </div>

          {error && (
            <p className="mb-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-between my-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between my-2">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>

          <div className="flex justify-between my-2">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between my-2 text-green-600">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}

          <hr className="my-3" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {isBuyer && (
            <button
              disabled={inStockItems.length === 0}
              onClick={handleCheckout}
              className={`mt-5 w-full rounded-lg py-3 text-sm text-white ${
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
