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
  const {
    cartItems,
    setCartItems, // ✅ IMPORTANT
  } = useCart();
  const { reduceStockAfterOrder } = useSellerProducts();

  const [method, setMethod] = useState("cod");
  const [error, setError] = useState("");

  /* ✅ ONLY IN-STOCK ITEMS */
  const checkoutItems = cartItems.filter(
    (item) => item.stock === undefined || item.stock > 0
  );

  const subtotal = checkoutItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const delivery = subtotal > 0 ? 99 : 0;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + delivery + gst;

  /* ✅ SELLER STOCK REDUCTION */
  const sellerItemsForStock = checkoutItems
    .filter((item) => item.sellerId)
    .map((item) => ({
      productId: item.id,
      quantity: item.qty,
    }));

  const handlePlaceOrder = () => {
    setError("");

    if (checkoutItems.length === 0) {
      setError("No available items to place order.");
      return;
    }

    /* ✅ BUILD ORDER ITEMS */
    const orderItems = checkoutItems.map((item) => ({
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
      status: "Placed",
      paymentMethod: method,
    };

    /* ✅ SAVE ORDER (CRITICAL) */
    placeOrder(order);

    /* ✅ REDUCE SELLER STOCK */
    if (sellerItemsForStock.length > 0) {
      reduceStockAfterOrder(sellerItemsForStock);
    }

    /* ✅ REMOVE ONLY PURCHASED ITEMS FROM CART */
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !checkoutItems.some(
            (p) => p.id === item.id
          )
      )
    );

    /* ✅ NAVIGATE AFTER EVERYTHING IS DONE */
    navigate("/order-success");
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
            className={`payment-option ${
              method === "upi" ? "active" : ""
            }`}
            onClick={() => setMethod("upi")}
          >
            📱 <strong>UPI</strong>
          </div>

          <div
            className={`payment-option ${
              method === "card" ? "active" : ""
            }`}
            onClick={() => setMethod("card")}
          >
            💳 <strong>Card</strong>
          </div>

          <div
            className={`payment-option ${
              method === "netbanking" ? "active" : ""
            }`}
            onClick={() => setMethod("netbanking")}
          >
            🏦 <strong>Net Banking</strong>
          </div>

          <div
            className={`payment-option ${
              method === "wallet" ? "active" : ""
            }`}
            onClick={() => setMethod("wallet")}
          >
            👛 <strong>Wallet</strong>
          </div>

          <div
            className={`payment-option ${
              method === "cod" ? "active" : ""
            }`}
            onClick={() => setMethod("cod")}
          >
            💵 <strong>Cash on Delivery</strong>
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
            <span>Subtotal ({checkoutItems.length} item)</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="price-row">
            <span>Delivery</span>
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
