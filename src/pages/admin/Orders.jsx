import "./Orders.css";

const orders = [
  {
    id: "ORD001",
    customer: "Arun Kumar",
    seller: "Tech Hub",
    total: "₹1,299",
    status: "Pending",
    date: "20 Jan 2026",
  },
  {
    id: "ORD002",
    customer: "Priya S",
    seller: "Green Mart",
    total: "₹499",
    status: "Delivered",
    date: "18 Jan 2026",
  },
  {
    id: "ORD003",
    customer: "Rahul M",
    seller: "Fashion Store",
    total: "₹899",
    status: "Cancelled",
    date: "17 Jan 2026",
  },
];

const Orders = () => {
  return (
    <div className="orders-container">
      <h2>Orders Management</h2>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Seller</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.seller}</td>
              <td>{order.total}</td>
              <td>{order.date}</td>
              <td>
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <button className="btn view">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
