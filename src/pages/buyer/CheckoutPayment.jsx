import "../../styles/checkoutPayment.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CheckoutSteps from "./CheckoutSteps";
import { useState } from "react";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [method, setMethod] = useState("cod");

  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );
  const delivery = 99;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + delivery + gst;

const placeOrder = () => {
  const order = {
    id: Date.now(),
    items: cartItems,
    address: JSON.parse(localStorage.getItem("checkoutAddress")) || null,

    total,
    date: new Date().toLocaleDateString(),
    status: "Placed"
  };

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  localStorage.setItem("orders", JSON.stringify([...orders, order]));

  navigate("/order-success");

  setTimeout(() => {
    clearCart();
  }, 100);
};



  return (
    <div className="checkout-wrapper">

      {/* CHECKOUT STEPS */}
      <CheckoutSteps currentStep={3} />

      <div className="checkout-grid">

        {/* LEFT – PAYMENT OPTIONS */}
        <div className="payment-card">
          <h2>Payment Options</h2>

          <div
            className={`payment-option ${method === "upi" ? "active" : ""}`}
            onClick={() => setMethod("upi")}
          >
            <span className="icon">📱</span>
            <div>
              <strong>UPI</strong>
              <p>Google Pay, PhonePe, Paytm & more</p>
            </div>
          </div>

          <div
            className={`payment-option ${method === "card" ? "active" : ""}`}
            onClick={() => setMethod("card")}
          >
            <span className="icon">💳</span>
            <div>
              <strong>Credit / Debit Card</strong>
              <p>Visa, MasterCard, RuPay & more</p>
            </div>
          </div>

          <div
            className={`payment-option ${method === "netbanking" ? "active" : ""}`}
            onClick={() => setMethod("netbanking")}
          >
            <span className="icon">🏦</span>
            <div>
              <strong>Net Banking</strong>
              <p>All major banks supported</p>
            </div>
          </div>

          <div
            className={`payment-option ${method === "wallet" ? "active" : ""}`}
            onClick={() => setMethod("wallet")}
          >
            <span className="icon">👛</span>
            <div>
              <strong>Wallets</strong>
              <p>Paytm, PhonePe, Amazon Pay</p>
            </div>
          </div>

          <div
            className={`payment-option ${method === "cod" ? "active" : ""}`}
            onClick={() => setMethod("cod")}
          >
            <span className="icon">💵</span>
            <div>
              <strong>Cash on Delivery</strong>
              <p>Pay when you receive</p>
            </div>
          </div>

          <div className="payment-actions">
            <button className="back-btn" onClick={() => navigate("/checkout/summary")}>
              Back
            </button>
            <button className="place-btn" onClick={placeOrder}>
              Place Order →
            </button>
          </div>
        </div>

        {/* RIGHT – PRICE DETAILS */}
        <div className="price-card">
          <h3>Price Details</h3>

          <div className="price-row">
            <span>Subtotal (1 item)</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="price-row">
            <span>Delivery Charges</span>
            <span>₹{delivery}</span>
          </div>

          <div className="price-row">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>

          <hr />

          <div className="price-total">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
