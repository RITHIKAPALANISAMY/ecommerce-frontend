import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSellerProducts } from "../../context/SellerProductContext";
import { jsPDF } from "jspdf";
import "../../styles/orderSuccess.css";

export default function OrderSuccess() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const processedRef = useRef(false);

  const { removeItem } = useCart();
  const { reduceStockAfterOrder } = useSellerProducts();

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (!orders.length) {
      navigate("/", { replace: true });
      return;
    }

    const latestOrder = orders[orders.length - 1];

    // ✅ GENERATE TRACKING ID ONCE
    if (!latestOrder.trackingId) {
      latestOrder.trackingId =
        "TRK" + Math.floor(100000000 + Math.random() * 900000000);
    }

    // ✅ SAVE UPDATED ORDER BACK
    const updatedOrders = [...orders];
    updatedOrders[updatedOrders.length - 1] = latestOrder;
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    setOrder(latestOrder);

    if (processedRef.current) return;
    processedRef.current = true;

    localStorage.removeItem("orderPlaced");

    reduceStockAfterOrder(latestOrder.items);

    latestOrder.items.forEach((item) => {
      removeItem(item.productId);
    });
  }, [navigate, removeItem, reduceStockAfterOrder]);

  if (!order) return null;

  return (
    <div className="order-success-page">
      <div className="success-icon">✔</div>

      <h2>Order Placed Successfully!</h2>
      <p>Thank you for shopping with ShopVerse</p>

      <div className="success-order-card">
        <div className="row">
          <span>Order ID</span>
          <strong>{order.id}</strong>
        </div>

        <div className="row">
          <span>Order Date</span>
          <strong>{order.date}</strong>
        </div>

        <div className="row">
          <span>Status</span>
          <strong>{order.status || "Placed"}</strong>
        </div>

        <div className="row">
          <span>Tracking ID</span>
          <strong>{order.trackingId}</strong>
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
        {order.items.map((item, idx) => (
          <div key={idx} className="order-item">
            <strong>{item.title}</strong>
            <p>Qty: {item.quantity || 1}</p>
            <p>₹{item.price}</p>
          </div>
        ))}

        <hr />

        <div className="total">
          <span>Total Paid</span>
          <strong>₹{order.total}</strong>
        </div>
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
