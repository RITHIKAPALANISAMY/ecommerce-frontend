import { useOrders } from "../../context/OrderContext";
import "./AdminOrders.css";

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useOrders();

  return (
    <div className="orders-container">
      <h2 className="orders-title">Orders</h2>

      {orders.length === 0 && (
        <p className="empty-text">No orders yet</p>
      )}

      {orders.length > 0 && (
        <div className="orders-table">
          {/* TABLE HEADER */}
          <div className="orders-row header">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {/* TABLE BODY */}
          {orders.map((o) => (
            <div key={o.id} className="orders-row">
              <span className="mono">#{o.id}</span>
              <span>{o.buyerName || "Customer"}</span>
              <span>₹{o.amount}</span>

              <span className={`status ${o.status.toLowerCase()}`}>
                {o.status}
              </span>

              <span className="actions">
                {o.status === "PLACED" ? (
                  <>
                    <button
                      className="btn approve"
                      onClick={() =>
                        updateOrderStatus(o.id, "Approved")
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="btn reject"
                      onClick={() =>
                        updateOrderStatus(o.id, "Cancelled")
                      }
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="dash">—</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
