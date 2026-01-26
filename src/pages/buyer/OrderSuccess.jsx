import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSellerProducts } from "../../context/SellerProductContext";
import { jsPDF } from "jspdf";
import "../../styles/orderSuccess.css";

export default function OrderSuccess() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const { removeItem } = useCart();
  const { reduceStockAfterOrder } = useSellerProducts();

  const processedRef = useRef(false);

  useEffect(() => {
    const orders =
      JSON.parse(localStorage.getItem("orders")) || [];

    if (orders.length === 0) {
      navigate("/", { replace: true });
      return;
    }

    const latestOrder = orders[orders.length - 1];
    setOrder(latestOrder);

    if (processedRef.current) return;
    processedRef.current = true;

    // ✅ ADDED: CLEAR ORDER FLAG (CRITICAL)
    localStorage.removeItem("orderPlaced");

    // ✅ Reduce stock
    reduceStockAfterOrder(latestOrder.items);

    // ✅ Remove purchased items from cart
    latestOrder.items.forEach((item) => {
      removeItem(item.productId);
    });
  }, [navigate, removeItem, reduceStockAfterOrder]);

  if (!order) return null;

  /* ================= PDF INVOICE ================= */
  const downloadInvoice = () => {
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("SHOPVERSE INVOICE", 14, y);

    y += 10;
    doc.setFontSize(11);
    doc.text(`Order ID: ${order.id}`, 14, y);
    y += 6;
    doc.text(`Order Date: ${order.date}`, 14, y);

    y += 10;
    doc.setFontSize(13);
    doc.text("Delivery Address", 14, y);

    y += 6;
    doc.setFontSize(11);
    doc.text(order.address?.name || "", 14, y);
    y += 5;
    doc.text(order.address?.phone || "", 14, y);
    y += 5;
    doc.text(
      `${order.address?.address}, ${order.address?.city}, ${order.address?.state} - ${order.address?.pincode}`,
      14,
      y
    );

    y += 10;
    doc.setFontSize(13);
    doc.text("Order Items", 14, y);

    y += 6;
    doc.setFontSize(11);

    order.items.forEach((item) => {
      doc.text(
        `${item.title} | Qty: ${item.quantity} | ₹${item.price * item.quantity}`,
        14,
        y
      );
      y += 6;
    });

    y += 6;
    doc.line(14, y, 195, y);

    y += 8;
    doc.setFontSize(12);
    doc.text(`Total Paid: ₹${order.total}`, 14, y);

    y += 6;
    doc.text(
      `Payment Method: ${order.paymentMethod || "Cash on Delivery"}`,
      14,
      y
    );

    y += 10;
    doc.setFontSize(10);
    doc.text(
      "Thank you for shopping with ShopVerse!",
      14,
      y
    );

    doc.save(`Invoice_${order.id}.pdf`);
  };

  return (
    <div className="order-success-page">
      <div className="success-icon">✔</div>

      <h2>Order Placed Successfully!</h2>
      <p>Thank you for shopping with ShopVerse</p>

      <button
        onClick={downloadInvoice}
        style={{
          margin: "16px 0",
          padding: "10px 18px",
          background: "#8b0020",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        ⬇ Download Invoice (PDF)
      </button>

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
