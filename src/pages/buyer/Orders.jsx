import "../../styles/orders.css";

export default function Orders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length > 0 && (
        <button
          onClick={() => {
            localStorage.removeItem("orders");
            window.location.reload();
          }}
          style={{
            background: "#b91c1c",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            cursor: "pointer"
          }}
        >
          Clear All Orders
        </button>
      )}

      {orders.length === 0 ? (
        <p>No orders placed yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
          </div>
        ))
      )}
    </div>
  );
}
