import ProductCard from "../../components/common/ProductCard";

export default function ProductList() {
  // Mock products (later replace with API)
  const products = [
    {
      id: 1,
      title: "Wireless Headphones",
      price: 2999,
      image: "https://via.placeholder.com/200",
      stock: 10, // ✅ In stock
    },
    {
      id: 2,
      title: "Smart Watch",
      price: 4999,
      image: "https://via.placeholder.com/200",
      stock: 3, // ⚠️ Low stock
    },
    {
      id: 3,
      title: "Bluetooth Speaker",
      price: 1999,
      image: "https://via.placeholder.com/200",
      stock: 0, // ❌ Out of stock
    },
    {
      id: 4,
      title: "Gaming Mouse",
      price: 1499,
      image: "https://via.placeholder.com/200",
      stock: 7,
    },
  ];

  return (
    <div className="product-list">
      <h2>All Products</h2>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
