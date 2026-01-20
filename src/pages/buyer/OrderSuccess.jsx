import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/orderSuccess.css";

export default function OrderSuccess() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const orders =
      JSON.parse(localStorage.getItem("orders")) || [];

    // 🔒 If no orders, redirect to home
    if (orders.length === 0) {
      navigate("/");
      return;
    }

    // ✅ Always show the latest order
    setOrder(orders[orders.length - 1]);
  }, [navigate]);

  if (!order) return null;

  return (
    <div className="order-success-page">
      <div className="success-icon">✔</div>

      <h2>Order Placed Successfully!</h2>
      <p>Thank you for shopping with ShopVerse</p>

      <div className="order-card">
        <div className="row">
          <span>Order ID</span>
          <strong>{order.id}</strong>
        </div>

        <div className="row">
          <span>Order Date</span>
          <strong>{order.date}</strong>
        </div>

        <hr />

        <h4>Delivery Address</h4>
        <p>{order.address?.name}</p>
        <p>{order.address?.phone}</p>
        <p>
          {order.address?.address}, {order.address?.city},{" "}
          {order.address?.state} - {order.address?.pincode}
        </p>

        <hr />

        <h4>Order Items</h4>
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <strong>{item.title}</strong>
            <p>Qty: {item.quantity}</p>
            <p>₹{item.price}</p>
          </div>
        ))}

        <hr />

        <div className="total">
          <span>Total Paid</span>
          <strong>₹{order.total}</strong>
        </div>

        <p className="payment-method">
          Payment Method:{" "}
          <strong>
            {order.paymentMethod || "Cash on Delivery"}
          </strong>
        </p>
      </div>

      <div className="actions">
        <button onClick={() => navigate("/orders")}>
          View Orders
        </button>
        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
