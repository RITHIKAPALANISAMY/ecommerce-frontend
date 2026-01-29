const Refunds = () => {
  return (
    <div className="admin-section">
      <h2>Refunds</h2>
      <p>Issue and monitor refunds here.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Refund ID</th>
            <th>Return ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>REF1001</td>
            <td>RET1001</td>
            <td>Sneha R</td>
            <td>₹499</td>
            <td>Processed</td>
          </tr>
          <tr>
            <td>REF1002</td>
            <td>RET1002</td>
            <td>Arun Kumar</td>
            <td>₹1299</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Refunds;
