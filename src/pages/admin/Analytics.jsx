import "./Analytics.css";

const categories = [
  { name: "Eco-Friendly", value: 15 },
  { name: "Beauty", value: 10 },
  { name: "Grocery", value: 10 },
  { name: "Fashion", value: 15 },
  { name: "Home & Kitchen", value: 15 },
  { name: "Electronics", value: 15 },
  { name: "Sports", value: 5 },
  { name: "Furniture", value: 5 },
];

const Analytics = () => {
  return (
    <div className="analytics-container">
      {/* LEFT */}
      <div className="analytics-card">
        <h3>📊 Products by Category</h3>

        {categories.map((c, i) => (
          <div className="category-row" key={i}>
            <span>{c.name}</span>
            <div className="bar-wrapper">
              <div
                className="bar-fill"
                style={{ width: `${c.value * 5}%` }}
              />
            </div>
            <strong>{c.value}</strong>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="analytics-card">
        <h3>📈 Sales Overview</h3>

        <div className="sales-item">
          <p>Total Revenue</p>
          <h2>₹0</h2>
        </div>

        <div className="sales-item">
          <p>Average Order Value</p>
          <h2>₹0</h2>
        </div>

        <div className="sales-item">
          <p>Total Orders</p>
          <h2>0</h2>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
