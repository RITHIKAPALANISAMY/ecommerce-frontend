import { useEffect, useState } from "react";
import "./AdminOrders.css";
import { useOrders } from "../../context/OrderContext";

const sampleOrders = [
  {
    id: "ORD1001",
    user: { name: "Arun Kumar" },
    status: "Pending",
    totalAmount: 1299,
    createdAt: new Date(),
    items: [
      { sellerId: 1, sellerName: "Tech Hub" }
    ],
  },
  {
    id: "ORD1002",
    user: { name: "Priya S" },
    status: "Approved",
    totalAmount: 799,
    createdAt: new Date(),
    items: [
      { sellerId: 2, sellerName: "Fashion Store" }
    ],
  },
  {
    id: "ORD1003",
    user: { name: "Rahul M" },
    status: "Delivered",
    totalAmount: 1599,
    createdAt: new Date(),
    items: [
      { sellerId: 3, sellerName: "Electro Mart" }
    ],
  },
  {
    id: "ORD1004",
    user: { name: "Sneha R" },
    status: "Cancelled",
    totalAmount: 499,
    createdAt: new Date(),
    items: [
      { sellerId: 4, sellerName: "Green Mart" }
    ],
  },
];

const Orders = () => {
  const { orders, placeOrder, updateSellerOrderStatus } = useOrders();
  const [filter, setFilter] = useState("All");

  /* 🔹 INJECT SAMPLE DATA ON FIRST LOAD */
  useEffect(() => {
  if (orders.length === 0) {
    const hasSample = localStorage.getItem("sample_orders_added");
    if (!hasSample) {
      sampleOrders.forEach((o) => placeOrder(o));
      localStorage.setItem("sample_orders_added", "true");
    }
  }
}, [orders, placeOrder]);


  /* 🔹 ADMIN STATUS UPDATE */
  const updateAdminOrderStatus = (order, status) => {
    order.items.forEach((item) => {
      updateSellerOrderStatus(order.id, item.sellerId, status);
    });
  };

 const filteredOrders =
  filter === "All"
    ? orders
    : orders.filter(
        (o) =>
          o.status &&
          o.status.toLowerCase() === filter.toLowerCase()
      );


  return (
    <div className="orders-container">
      <h2>Orders Management</h2>

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
            filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user?.name}</td>
                <td>
                  {[...new Set(order.items.map(i => i.sellerName))].join(", ")}
                </td>
                <td>₹{order.totalAmount}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>

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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
