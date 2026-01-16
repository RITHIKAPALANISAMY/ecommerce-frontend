import "../../styles/cart.css";
import CartItem from "../../components/buyer/CartItem";
import { useCart } from "../../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Cart() {
  const {
    cartItems,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ BUY NOW ITEM FROM PRODUCT PAGE
  const buyNowItem = location.state?.buyNowItem;

  // ✅ DECIDE WHAT TO SHOW
  const itemsToShow = buyNowItem ? [buyNowItem] : cartItems;

  const [couponInput, setCouponInput] = useState("");
  const [error, setError] = useState("");

  const subtotal = itemsToShow.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const gst = Math.round(subtotal * 0.18);
  let discount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === "PERCENT") {
      discount = Math.round(subtotal * (appliedCoupon.value / 100));
    } else {
      discount = appliedCoupon.value;
    }
  }

  const total = subtotal + gst + 99 - discount;

  const handleApply = () => {
    const msg = applyCoupon(couponInput.trim(), subtotal);
    setError(msg || "");
  };

  return (
    <div className="cart-page">
      <h2 className="cart-title">
        Shopping Cart ({itemsToShow.length} items)
      </h2>

      <div className="cart-container">
        {/* LEFT */}
        <div className="cart-left">
          {itemsToShow.map(item => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="coupon-box">
            <h4>Available Coupons</h4>

            <div className="coupon">
              <div>
                <strong>WELCOME10</strong>
                <p>10% OFF on orders above ₹500</p>
              </div>
              <button onClick={() => setCouponInput("WELCOME10")}>
                Apply
              </button>
            </div>

            <div className="coupon">
              <div>
                <strong>SAVE500</strong>
                <p>₹500 OFF on orders above ₹2000</p>
              </div>
              <button onClick={() => setCouponInput("SAVE500")}>
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
              onChange={e => setCouponInput(e.target.value)}
              placeholder="Enter coupon code"
            />
            <button onClick={handleApply}>Apply</button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {appliedCoupon && (
            <p style={{ color: "green" }}>
              {appliedCoupon.code} applied
              <button
                onClick={removeCoupon}
                style={{ marginLeft: 10, color: "red" }}
              >
                Remove
              </button>
            </p>
          )}

          <div className="price-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="price-row">
            <span>Shipping</span>
            <span>₹99</span>
          </div>

          <div className="price-row">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>

          {discount > 0 && (
            <div className="price-row" style={{ color: "green" }}>
              <span>Coupon Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}

          <hr />

          <div className="price-total">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>

          <button onClick={() => navigate("/checkout/address")}>
  Proceed to Checkout →
</button>

        </div>
      </div>
    </div>
  );
}
