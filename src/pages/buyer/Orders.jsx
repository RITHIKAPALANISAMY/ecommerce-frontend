import "../../styles/orders.css";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";
import { useState } from "react";

export default function Orders() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { getBuyerOrders } = useOrders();

  const orders = getBuyerOrders(user.email);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openOrderId, setOpenOrderId] = useState(null);

  const deliveredCount = orders.filter(
    o => o.status === "Delivered"
  ).length;

  const cancelledCount = orders.filter(
    o => o.status === "Cancelled"
  ).length;

  const filteredOrders = orders.filter(order => {
    const matchSearch = order.items.some(i =>
      i.title.toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getProductImage = (item) => {
    return (
      item.image ||
      products.find(p => p.id === item.productId)?.image ||
      "/placeholder.png"
    );
  };

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {/* SUMMARY */}
      <div className="orders-summary">
        <div><strong>{orders.length}</strong><span>Total Orders</span></div>
        <div><strong>{deliveredCount}</strong><span>Delivered</span></div>
        <div><strong>{cancelledCount}</strong><span>Cancelled</span></div>
      </div>

      {/* FILTER */}
      <div className="orders-toolbar">
        <input
          placeholder="Search your orders"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="Delivered">Delivered</option>
          <option value="Shipped">Shipped</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* ORDERS */}
      {filteredOrders.map(order => {
        const total = order.items.reduce(
          (sum, i) => sum + i.price * (i.quantity || 1),
          0
        );

        const firstItem = order.items[0];

        return (
          <div key={order.id} className="order-wrapper">
            {/* COLLAPSED CARD */}
            <div className="order-card compact">
              <img
                className="order-thumb"
                src={getProductImage(firstItem)}
                alt={firstItem.title}
              />

              <div className="order-summary">
                <p className="order-title">
                  {firstItem.title}
                  {order.items.length > 1 && (
                    <span className="more-items">
                      {" "}+{order.items.length - 1} more
                    </span>
                  )}
                </p>

                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-meta">
                <p className="order-price">₹{total}</p>
                <button
                  className="arrow-btn"
                  onClick={() =>
                    setOpenOrderId(openOrderId === order.id ? null : order.id)
                  }
                >
                  {openOrderId === order.id ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {/* EXPANDED DETAILS */}
            {openOrderId === order.id && (
              <div className="order-details expanded">
                <p className="detail-tracking">
                  Tracking ID:{" "}
                  <strong>
                    {order.trackingId || "Will be assigned soon"}
                  </strong>
                </p>

                {order.items.map(item => (
                  <div key={item.productId} className="detail-row">
                    <div className="detail-left">
                      <p className="detail-name">{item.title}</p>
                      <p className="detail-qty">
                        Qty: {item.quantity || 1}
                      </p>
                      <p className="detail-status info">
                        Status: {order.status}
                      </p>
                    </div>

                    <p className="detail-price">
                      ₹{item.price * (item.quantity || 1)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
