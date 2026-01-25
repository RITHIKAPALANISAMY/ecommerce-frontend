import "../../styles/checkoutPayment.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CheckoutSteps from "./CheckoutSteps";
import { useState } from "react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { useSellerProducts } from "../../context/SellerProductContext";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { hasSufficientStock, reduceStockAfterOrder } =
    useSellerProducts();

  const [method, setMethod] = useState("cod");
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );
  const delivery = 99;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + delivery + gst;

  const sellerItemsForStock = cartItems
    .filter((item) => item.sellerId)
    .map((item) => ({
      productId: item.id,
      quantity: item.qty,
    }));

  const handlePlaceOrder = () => {
    setError("");

    if (
      sellerItemsForStock.length > 0 &&
      !hasSufficientStock(sellerItemsForStock)
    ) {
      setError(
        "Some seller items in your cart are out of stock or exceed available quantity."
      );
      return;
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.id,
      title: item.title,
      price: item.price,
      quantity: item.qty,
      sellerId: item.sellerId || "admin",
    }));

    const order = {
      id: Date.now(),
      buyerEmail: user.email,
      items: orderItems,
      address:
        JSON.parse(localStorage.getItem("checkoutAddress")) || null,
      total,
      date: new Date().toLocaleDateString(),
      status: "Delivered", // simulate delivery for now

      paymentMethod: method,
    };

    placeOrder(order);

    if (sellerItemsForStock.length > 0) {
      reduceStockAfterOrder(sellerItemsForStock);
    }

    

    // ✅ FIXED NAVIGATION (THIS IS THE KEY)
    navigate("/order-success");
    clearCart();

  };

  return (
    <div className="checkout-wrapper">
      <CheckoutSteps currentStep={3} />

      <div className="checkout-grid">
        <div className="payment-card">
          <h2>Payment Options</h2>

          {error && (
            <div className="checkout-error">⚠️ {error}</div>
          )}

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
            className={`payment-option ${
              method === "netbanking" ? "active" : ""
            }`}
            onClick={() => setMethod("netbanking")}
          >
            <span className="icon">🏦</span>
            <div>
              <strong>Net Banking</strong>
              <p>All major banks supported</p>
            </div>
          </div>

          <div
            className={`payment-option ${
              method === "wallet" ? "active" : ""
            }`}
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
            <button
              className="back-btn"
              onClick={() => navigate("/checkout/summary")}
            >
              Back
            </button>

            <button
              className="place-btn"
              onClick={handlePlaceOrder}
            >
              Place Order →
            </button>
          </div>
        </div>

        <div className="price-card">
          <h3>Price Details</h3>

          <div className="price-row">
            <span>Subtotal ({cartItems.length} item)</span>
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
