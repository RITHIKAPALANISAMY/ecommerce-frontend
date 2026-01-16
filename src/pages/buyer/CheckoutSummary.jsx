import "../../styles/checkoutSummary.css";
import CheckoutSteps from "./CheckoutSteps";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function CheckoutSummary() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const address = JSON.parse(
  localStorage.getItem("checkoutAddress")
);


  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );
  

  const delivery = 99;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + delivery + gst;

  return (
    <div className="checkout-page">

      {/* FLOW */}
      <CheckoutSteps currentStep={2} />

      {/* CONTENT */}
      <div className="checkout-grid">

        {/* LEFT */}
        <div className="summary-card">
          <h2>Order Summary</h2>

          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <img src={item.image} alt={item.title} />
              <div className="summary-info">
                <p className="title">{item.title}</p>
                <p>Qty: {item.qty}</p>
                <p className="price">₹{item.price}</p>
              </div>
            </div>
          ))}

          <hr />

          <h4 className="section-title">Deliver to:</h4>
          {address && (
  <div className="address-box">
    <strong>{address.name}</strong>
    <p>{address.phone}</p>
    <p>{address.address}</p>
    <p>
      {address.city}, {address.state} - {address.pincode}
    </p>
  </div>
)}

          <div className="summary-actions">
            <button
              className="back-btn"
              onClick={() => navigate("/checkout/address")}
            >
              Back
            </button>

            <button
              className="continue-btn"
              onClick={() => navigate("/checkout/payment")}
            >
              Continue to Payment →
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="price-card">
          <h3>Price Details</h3>

          <div className="price-row">
            <span>Subtotal (1 items)</span>
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
