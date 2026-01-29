import { useState } from "react";
import "./AdminOrders.css";
import { useOrders } from "../../context/OrderContext";

const AdminOrders = () => {
  const { orders, updateSellerOrderStatus } = useOrders();
  const [filter, setFilter] = useState("All");

  /* 🔥 ONLY BUYER ORDERS */
  const buyerOrders = orders.filter(
    (o) => o.source === "BUYER"
  );

  /* 🔹 FILTER BY STATUS */
  const filteredOrders =
    filter === "All"
      ? buyerOrders
      : buyerOrders.filter(
          (o) =>
            typeof o.status === "string" &&
            o.status.toLowerCase() === filter.toLowerCase()
        );

  /* 🔹 ADMIN STATUS UPDATE */
  const updateAdminOrderStatus = (order, status) => {
    order.items.forEach((item) => {
      updateSellerOrderStatus(order.id, item.sellerId, status);
    });
  };

  return (
    <div className="orders-container">
      <h2>Admin Orders</h2>

      {/* FILTER BAR */}
      <div className="order-filters">
        {["All", "Pending", "Approved", "Delivered", "Cancelled"].map(
          (status) => (
            <button
              key={status}
              className={`filter-btn ${
                filter === status ? "active" : ""
              }`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* TABLE */}
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Seller</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No orders found
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => {
              const sellers = [
                ...new Set(order.items.map((i) => i.sellerName)),
              ].join(", ");

              return (
                <tr key={order.id}>
                  <td>{order.id}</td>

                  {/* CUSTOMER */}
                  <td>{order.user?.name || "Customer"}</td>

                  {/* SELLER */}
                  <td>{sellers || "-"}</td>

                  {/* TOTAL */}
                  <td>₹{order.totalAmount ?? 0}</td>

                  {/* DATE */}
                  <td>
                    {order.date
                      ? new Date(order.date).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`status ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td style={{ textAlign: "center" }}>
                    {order.status === "Pending" && (
                      <div className="action-group">
                        <button
                          className="btn approve"
                          onClick={() =>
                            updateAdminOrderStatus(order, "Approved")
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="btn reject"
                          onClick={() =>
                            updateAdminOrderStatus(order, "Cancelled")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {order.status === "Approved" && (
                      <button
                        className="btn deliver"
                        onClick={() =>
                          updateAdminOrderStatus(order, "Delivered")
                        }
                      >
                        Mark Delivered
                      </button>
                    )}

                    {(order.status === "Delivered" ||
                      order.status === "Cancelled") && (
                      <button className="btn disabled" disabled>
                        {order.status}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
