const orders = [
  { id: 101, buyer: "Arun", amount: "₹2000", status: "Delivered" },
  { id: 102, buyer: "Kavya", amount: "₹1200", status: "Pending" },
];

const Orders = () => {
  return (
    <div>
      <h2>Orders</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Buyer</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.buyer}</td>
              <td>{o.amount}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
