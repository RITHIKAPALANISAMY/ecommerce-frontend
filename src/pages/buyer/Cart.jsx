import "../../styles/cart.css";
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
    <div className="cart-page">
      <h2 className="cart-title">
        Shopping Cart ({itemsToShow.length} items)
      </h2>

      {/* 🟡 INFO MESSAGE — NOT BLOCKING */}
      {outOfStockItems.length > 0 && (
        <div className="cart-warning centered">
          Some items are currently <strong>out of stock</strong>.
          <br />
          They won’t be included in checkout.
        </div>
      )}

      <div className="cart-container">
        {/* LEFT */}
        <div className="cart-left">
          {itemsToShow.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="coupon-box">
            <h4>Available Coupons</h4>

            <div className="coupon">
              <div>
                <strong>WELCOME10</strong>
                <p>10% OFF on orders above ₹500</p>
              </div>
              <button
                onClick={() => setCouponInput("WELCOME10")}
              >
                Apply
              </button>
            </div>

            <div className="coupon">
              <div>
                <strong>SAVE500</strong>
                <p>₹500 OFF on orders above ₹2000</p>
              </div>
              <button
                onClick={() => setCouponInput("SAVE500")}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="cart-right">
          <h4>Price Details</h4>

          <div className="coupon-input">
            <input
              value={couponInput}
              onChange={(e) =>
                setCouponInput(e.target.value)
              }
              placeholder="Enter coupon code"
            />
            <button onClick={handleApply}>Apply</button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="price-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="price-row">
            <span>Shipping</span>
            <span>₹{subtotal > 0 ? 99 : 0}</span>
          </div>

          <div className="price-row">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>

          {discount > 0 && (
            <div
              className="price-row"
              style={{ color: "green" }}
            >
              <span>Coupon Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}

          <hr />

          <div className="price-total">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>

          {/* ✅ CHECKOUT — ONLY IF IN-STOCK ITEMS EXIST */}
          {isBuyer && (
            <button
              className="checkout-btn"
              disabled={inStockItems.length === 0}
              onClick={() =>
                navigate("/checkout/address", {
                  state: { checkoutItems: inStockItems },
                })
              }
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
