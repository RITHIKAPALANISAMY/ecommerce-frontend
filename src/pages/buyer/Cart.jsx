
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
    removeCoupon
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= BLOCK CART AFTER ORDER ================= */
  useEffect(() => {
    const orderPlaced = localStorage.getItem("orderPlaced");
    if (orderPlaced === "true") {
      navigate("/order-success", { replace: true });
    }
  }, [navigate]);
  /* ========================================================== */

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
  const itemsToShow = buyNowItem ? [buyNowItem] : cartItems;

  const [couponInput, setCouponInput] = useState("");
  const [error, setError] = useState("");

  /* ================= SPLIT STOCK ================= */
  const inStockItems = useMemo(
    () =>
      itemsToShow.filter(
        (item) => item.stock === undefined || item.stock > 0
      ),
    [itemsToShow]
  );

  const outOfStockItems = useMemo(
    () =>
      itemsToShow.filter(
        (item) => item.stock !== undefined && item.stock === 0
      ),
    [itemsToShow]
  );

  /* ================= PRICE (ONLY IN STOCK) ================= */
  const subtotal = inStockItems.reduce(
    (sum, i) =>
      sum + Number(i.price) * (Number(i.qty) || 1),
    0
  );

  const gst = Math.round(subtotal * 0.18);
  let discount = 0;

  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.type === "PERCENT") {
      discount = Math.round(
        subtotal * (appliedCoupon.value / 100)
      );
    } else {
      discount = appliedCoupon.value;
    }
  }

  const total =
    subtotal > 0 ? subtotal + gst + 99 - discount : 0;

  const handleApply = () => {
    const msg = applyCoupon(couponInput.trim(), subtotal);
    setError(msg || "");
  };

  const isBuyer = user?.role === "buyer";

  return (
  <div className="bg-gray-100 py-8 pb-16">
    <h2 className="max-w-6xl mx-auto mb-5 text-xl font-semibold">
      Shopping Cart ({itemsToShow.length} items)
    </h2>

    {outOfStockItems.length > 0 && (
      <div className="max-w-6xl mx-auto mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
        Some items are currently <strong>out of stock</strong>.
        <br />
        They won’t be included in checkout.
      </div>
    )}

    <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* LEFT */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        {itemsToShow.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}

        {/* COUPONS */}
        <div className="rounded-xl bg-white p-4">
          <h4 className="font-semibold mb-3">Available Coupons</h4>

          <div className="mb-3 flex items-center justify-between rounded-lg border border-dashed border-red-700 p-3">
            <div>
              <strong>WELCOME10</strong>
              <p className="text-sm text-gray-600">
                10% OFF on orders above ₹500
              </p>
            </div>
            <button
              onClick={() => setCouponInput("WELCOME10")}
              className="rounded-md bg-red-700 px-4 py-1.5 text-white"
            >
              Apply
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-dashed border-red-700 p-3">
            <div>
              <strong>SAVE500</strong>
              <p className="text-sm text-gray-600">
                ₹500 OFF on orders above ₹2000
              </p>
            </div>
            <button
              onClick={() => setCouponInput("SAVE500")}
              className="rounded-md bg-red-700 px-4 py-1.5 text-white"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="h-fit rounded-xl bg-white p-5 shadow">
        <h4 className="font-semibold mb-4">Price Details</h4>

        <div className="mb-4 flex gap-2">
          <input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
          />
          <button
            onClick={handleApply}
            className="rounded-md bg-red-700 px-4 py-2 text-white"
          >
            Apply
          </button>
        </div>

        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

        <div className="flex justify-between my-2">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between my-2">
          <span>Shipping</span>
          <span>₹{subtotal > 0 ? 99 : 0}</span>
        </div>

        <div className="flex justify-between my-2">
          <span>GST (18%)</span>
          <span>₹{gst}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between my-2 text-green-600">
            <span>Coupon Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}

        <hr className="my-3" />

        <div className="flex justify-between text-lg font-bold">
          <span>Total Amount</span>
          <span>₹{total}</span>
        </div>

        {isBuyer && (
          <button
            disabled={inStockItems.length === 0}
            onClick={() =>
              navigate("/checkout/address", {
                state: { checkoutItems: inStockItems },
              })
            }
            className={`mt-5 w-full rounded-lg py-3 text-white text-sm
              ${
                inStockItems.length === 0
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-red-800 hover:bg-red-900"
              }`}
          >
            {inStockItems.length === 0
              ? "No available items to checkout"
              : "Proceed to Checkout →"}
          </button>
        )}
      </div>
    </div>
  </div>
);
}
