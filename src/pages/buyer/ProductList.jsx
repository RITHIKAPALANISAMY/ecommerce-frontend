import ProductCard from "../../components/common/ProductCard";

export default function ProductList() {
  const products = [
    {
      id: 1,
      title: "Wireless Headphones",
      price: 2999,
      images: ["https://via.placeholder.com/400"], 
      stock: 10,
      rating: 4,
      brand: "SoundMax",
    },
    {
      id: 2,
      title: "Smart Watch",
      price: 4999,
      images: ["https://via.placeholder.com/400"],
      stock: 3, 
      rating: 3,
      brand: "TimeTech",
    },
    {
      id: 3,
      title: "Bluetooth Speaker",
      price: 1999,
      images: ["https://via.placeholder.com/400"],
      stock: 0,
      rating: 4,
      brand: "BoomAudio",
    },
    {
      id: 4,
      title: "Gaming Mouse",
      price: 1499,
      images: ["https://via.placeholder.com/400"],
      stock: 7,
      rating: 5,
      brand: "ProGear",
    },
  ];

  return (
    <div className="bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          All Products
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
