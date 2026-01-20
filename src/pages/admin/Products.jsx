const products = [
  { id: 1, name: "iPhone 14", seller: "Tech Store", status: "Pending" },
  { id: 2, name: "Shoes", seller: "Fashion Hub", status: "Approved" },
];

const Products = () => {
  return (
    <div>
      <h2>Products Approval</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Seller</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.seller}</td>
              <td>{p.status}</td>
              <td>
                <button className="btn approve">Approve</button>
                <button className="btn reject">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
