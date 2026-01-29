const Returns = () => {
  return (
    <div className="admin-section">
      <h2>Returns</h2>
      <p>Track and manage product returns here.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Return ID</th>
            <th>Order ID</th>
            <th>User</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>RET1001</td>
            <td>ORD1003</td>
            <td>Sneha R</td>
            <td>Damaged item</td>
            <td>Pending</td>
          </tr>
          <tr>
            <td>RET1002</td>
            <td>ORD1005</td>
            <td>Arun Kumar</td>
            <td>Wrong size</td>
            <td>Approved</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Returns;
