import { useState } from "react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import "../../styles/seller/sellerOrders.css";

export default function SellerOrders() {
  const { orders, updateSellerOrderStatus } = useOrders();
  const { user } = useAuth();

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const sellerId = user.email;

  /* ================= SELLER ORDERS ONLY ================= */
  const sellerOrders = orders
    .map((order) => {
      const sellerItems = order.items.filter(
        (item) => item.sellerId === sellerId
      );
      if (sellerItems.length === 0) return null;
      return { ...order, items: sellerItems };
    })
    .filter(Boolean);

  /* ================= STATUS FILTER ================= */
  const filteredOrders =
    statusFilter === "ALL"
      ? sellerOrders
      : sellerOrders.filter(
          (order) => order.status === statusFilter
        );

  /* ================= REVENUE ================= */
  const totalRevenue = filteredOrders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (s, i) => s + i.price * i.quantity,
        0
      ),
    0
  );

  /* ================= HANDLERS ================= */
  const handleStatusChange = (orderId, newStatus) => {
    updateSellerOrderStatus(orderId, sellerId, newStatus);
  };

  const confirmCancelOrder = () => {
    if (confirmCancel) {
      updateSellerOrderStatus(confirmCancel, sellerId, "Cancelled");
      setConfirmCancel(null);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(
      expandedOrderId === orderId ? null : orderId
    );
  };

  return (
    <div className="seller-orders">
      <h2>My Orders</h2>

      {/* FILTER */}
      <div className="orders-filter">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Orders</option>
          <option value="Placed">Placed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* STATS */}
      <div className="seller-stats">
        <div>
          <strong>{filteredOrders.length}</strong>
          <span>Total Orders</span>
        </div>
        <div>
          <strong>₹{totalRevenue}</strong>
          <span>Total Revenue</span>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <p>No orders found.</p>
      )}

      {filteredOrders.map((order) => {
        const isExpanded = expandedOrderId === order.id;

        return (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>Order ID: {order.id}</span>
              <span>{order.date}</span>
              <span>Buyer: {order.buyerEmail}</span>

              <span className="order-status">
                Status:
                <span
                  className={`status-badge ${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </span>

              <button
                className="view-toggle"
                onClick={() => toggleExpand(order.id)}
              >
                {isExpanded ? "Hide Details" : "View Details"}
              </button>
            </div>

            {isExpanded && (
              <>
                {order.items.map((item) => (
                  <div key={item.productId} className="order-item">
                    <strong>{item.title}</strong>
                    <span>Qty: {item.quantity}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}

                <div className="order-actions">
                  {order.status === "Placed" && (
                    <>
                      <button
                        className="status-btn ship"
                        onClick={() =>
                          handleStatusChange(order.id, "Shipped")
                        }
                      >
                        Mark as Shipped
                      </button>

                      <button
                        className="status-btn cancel"
                        onClick={() => setConfirmCancel(order.id)}
                      >
                        Cancel Order
                      </button>
                    </>
                  )}

                  {order.status === "Shipped" && (
                    <button
                      className="status-btn deliver"
                      onClick={() =>
                        handleStatusChange(order.id, "Delivered")
                      }
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* CANCEL CONFIRM MODAL */}
      {confirmCancel && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cancel Order?</h3>
            <p>This action cannot be undone.</p>

            <div className="modal-actions">
              <button
                className="status-btn cancel"
                onClick={confirmCancelOrder}
              >
                Yes, Cancel
              </button>
              <button
                className="status-btn"
                onClick={() => setConfirmCancel(null)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
