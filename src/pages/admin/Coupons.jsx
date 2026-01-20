const coupons = [
  { code: "SHOP10", discount: "10%" },
  { code: "SALE20", discount: "20%" },
];

const Coupons = () => {
  return (
    <div>
      <h2>Coupons & Deals</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Coupon Code</th>
            <th>Discount</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((c, index) => (
            <tr key={index}>
              <td>{c.code}</td>
              <td>{c.discount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Coupons;
