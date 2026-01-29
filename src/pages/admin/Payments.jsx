const Payments = () => {
  return (
    <div className="admin-section">
      <h2>Payments</h2>
      <p>Manage and process customer payments here.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Order ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>PAY1001</td>
            <td>ORD1001</td>
            <td>Arun Kumar</td>
            <td>₹1299</td>
            <td>UPI</td>
            <td>Completed</td>
          </tr>
          <tr>
            <td>PAY1002</td>
            <td>ORD1002</td>
            <td>Priya S</td>
            <td>₹799</td>
            <td>Card</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
