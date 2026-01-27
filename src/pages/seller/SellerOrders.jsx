import { useState, useMemo } from "react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import "../../styles/seller/sellerOrders.css";

export default function SellerOrders() {
  const {
    orders = [],
    updateSellerOrderStatus,
    cancelOrderBySeller, // ✅ IMPORTANT
  } = useOrders();

  const { user } = useAuth();
  const sellerId = user?.email || "";

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [search, setSearch] = useState("");

  /* ================= SELLER ORDERS ONLY ================= */
  const sellerOrders = useMemo(() => {
    if (!sellerId) return [];

    return orders
      .map((order) => {
        const items = order.items?.filter(
          (item) => item.sellerId === sellerId
        );
        return items?.length ? { ...order, items } : null;
      })
      .filter(Boolean);
  }, [orders, sellerId]);

  /* ================= FILTER ================= */
  const filteredOrders =
    statusFilter === "ALL"
      ? sellerOrders
      : sellerOrders.filter((order) => order.status === statusFilter);

  /* ================= SEARCH ================= */
  const searchedOrders = filteredOrders.filter((order) => {
    const q = search.toLowerCase();
    return (
      String(order.id).includes(q) ||
      String(order.buyerEmail || "").toLowerCase().includes(q)
    );
  });

  /* ================= METRICS ================= */
  const totalRevenue = searchedOrders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (s, i) =>
          i.status === "Cancelled"
            ? s
            : s + i.price * i.quantity,
        0
      ),
    0
  );

  const deliveredCount = searchedOrders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const cancelledCount = searchedOrders.filter(
    (o) => o.status === "Cancelled"
  ).length;

  /* ================= DATE HELPERS ================= */
  const today = () => new Date().toISOString().split("T")[0];

  const expectedDelivery = () => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split("T")[0];
  };

  /* ================= UI ================= */
  return (
    <div className="seller-orders">
      <h2>My Orders</h2>

      {/* FILTER BAR */}
      <div className="orders-filter-bar">
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

        <input
          type="text"
          placeholder="Search by Order ID or Buyer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* STATS */}
      <div className="seller-stats">
        <div>
          <strong>{searchedOrders.length}</strong>
          <span>Total Orders</span>
        </div>
        <div>
          <strong>₹{totalRevenue}</strong>
          <span>Total Revenue</span>
        </div>
        <div>
          <strong>{deliveredCount}</strong>
          <span>Delivered</span>
        </div>
        <div>
          <strong>{cancelledCount}</strong>
          <span>Cancelled</span>
        </div>
      </div>

      {/* ORDERS LIST */}
      {searchedOrders.map((order) => {
        const expanded = expandedOrderId === order.id;
        const status = order.status?.toLowerCase();

        const amount = order.items.reduce(
          (s, i) =>
            i.status === "Cancelled"
              ? s
              : s + i.price * i.quantity,
          0
        );

        return (
          <div className="order-card" key={order.id}>
            <div className="order-row">
              <div className="order-left">
                <strong>ID: {order.id}</strong>
                <span>{order.placedDate}</span>
                <span>{order.buyerEmail}</span>
              </div>

              <div className="order-right">
                <span className={`status-badge ${status}`}>
                  {order.status}
                </span>

                <span className="order-amount">
                  ₹{amount}
                </span>

                <button
                  className="view-btn"
                  onClick={() =>
                    setExpandedOrderId(
                      expanded ? null : order.id
                    )
                  }
                >
                  {expanded ? "Hide" : "View"}
                </button>
              </div>
            </div>

            {/* EXPANDED */}
            {expanded && (
              <>
                {order.items.map((item) => (
                  <div
                    className="order-item"
                    key={item.productId}
                  >
                    <span>{item.title}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}

                {/* TRACKING */}
                <div className="order-tracking">
                  {order.shippedDate && (
                    <p>📦 Shipped: {order.shippedDate}</p>
                  )}
                  {order.expectedDeliveryDate && (
                    <p>
                      🚚 Expected:{" "}
                      {order.expectedDeliveryDate}
                    </p>
                  )}
                  {order.deliveredDate && (
                    <p>✅ Delivered: {order.deliveredDate}</p>
                  )}
                  {order.cancelledDate && (
                    <p>❌ Cancelled: {order.cancelledDate}</p>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="order-actions">
                  {status === "placed" && (
                    <>
                      <button
                        className="btn ship"
                        onClick={() =>
                          updateSellerOrderStatus(
                            order.id,
                            sellerId,
                            "Shipped",
                            {
                              shippedDate: today(),
                              expectedDeliveryDate:
                                expectedDelivery(),
                            }
                          )
                        }
                      >
                        Mark Shipped
                      </button>

                      <button
                        className="btn cancel"
                        onClick={() =>
                          cancelOrderBySeller(
                            order.id,
                            sellerId
                          )
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {status === "shipped" && (
                    <button
                      className="btn deliver"
                      onClick={() =>
                        updateSellerOrderStatus(
                          order.id,
                          sellerId,
                          "Delivered",
                          { deliveredDate: today() }
                        )
                      }
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
