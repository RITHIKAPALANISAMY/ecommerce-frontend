import CartItem from "../../components/buyer/CartItem";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const buyNowItems = cartItems.filter(
    (item) => item.buyNow === true
  );

  const itemsToShow =
    buyNowItems.length > 0 ? buyNowItems : cartItems;

  const [couponInput, setCouponInput] = useState("");
  const [error, setError] = useState("");

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

  const subtotal = inStockItems.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.quantity),
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

  const handleApply = () => {
    const msg = applyCoupon(couponInput.trim(), subtotal);
    setError(msg || "");
  };

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

  const isBuyer = user?.role === "BUYER";


  return (
    <div className="bg-gray-100 py-8 pb-16">
      <h2 className="mx-auto mb-6 max-w-6xl text-xl font-semibold text-gray-800">
        Shopping Cart ({itemsToShow.length} items)
      </h2>

      {outOfStockItems.length > 0 && (
        <div className="mx-auto mb-5 max-w-6xl rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
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

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h4 className="mb-4 font-semibold text-gray-800">
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
                className="mb-3 flex items-center justify-between rounded-lg border border-dashed border-red-600 bg-red-50/30 p-3"
              >
                <div>
                  <strong className="text-red-700">
                    {c.code}
                  </strong>
                  <p className="text-sm text-gray-600">
                    {c.desc}
                  </p>
                </div>
                <button
                  onClick={() => setCouponInput(c.code)}
                  className="rounded-md bg-red-700 px-4 py-1.5 text-sm text-white transition hover:bg-red-800"
                >
                  Apply
                </button>
              </div>
            ))}

            {appliedCoupon && (
              <button
                onClick={removeCoupon}
                className="mt-2 text-sm font-medium text-red-600 underline"
              >
                Remove Coupon
              </button>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="h-fit rounded-xl bg-white p-6 shadow-md">
          <h4 className="mb-4 font-semibold text-gray-800">
            Price Details
          </h4>

          <div className="mb-4 flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm transition focus:border-red-500 focus:outline-none"
            />
            <button
              onClick={handleApply}
              className="rounded-md bg-red-700 px-4 py-2 text-sm text-white transition hover:bg-red-800"
            >
              Apply
            </button>
          </div>

          {error && (
            <p className="mb-2 text-sm text-red-600">
              {error}
            </p>
          )}

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

          {isBuyer && (
            <button
              disabled={inStockItems.length === 0}
              onClick={handleCheckout}
              className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition ${
                inStockItems.length === 0
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-red-800 hover:bg-red-900 hover:shadow"
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
