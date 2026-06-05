import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/common/ProductCard";
import { toast } from "react-toastify";

const PRODUCT_API = "http://localhost:8082/api/products";
const CATEGORY_API = "http://localhost:8082/api/categories";

export default function CategoryPage() {
  const { category } = useParams(); // 🔥 This is Mongo categoryId

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const [sort, setSort] = useState("FEATURED");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [brands, setBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    if (category) {
      fetchCategoryDetails();
      fetchCategoryProducts();
    }
  }, [category]);

  /* ================= FETCH CATEGORY NAME ================= */
  const fetchCategoryDetails = async () => {
    try {
      const res = await axios.get(`${CATEGORY_API}/${category}`);
      setCategoryName(res.data.name);
    } catch (err) {
      console.error(err);
      setCategoryName("Category");
    }
  };

  /* ================= FETCH PRODUCTS ================= */
  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${PRODUCT_API}/category/${category}`
      );

      setProducts(res.data || []);
    } catch (err) {
      toast.error("Failed to load category products");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BRAND LIST ================= */
  const allBrands = [
    ...new Set(products.map((p) => p.brand).filter(Boolean)),
  ];

  /* ================= FILTER + SORT ================= */
  const filteredProducts = products
    .filter((p) => p.price <= maxPrice)
    .filter((p) =>
      brands.length === 0 ? true : brands.includes(p.brand)
    )
    .filter((p) => (p.averageRating || 0) >= minRating)
    .sort((a, b) => {
      switch (sort) {
        case "LOW_HIGH":
          return a.price - b.price;
        case "HIGH_LOW":
          return b.price - a.price;
        case "RATING_HIGH_LOW":
          return (b.averageRating || 0) - (a.averageRating || 0);
        case "RATING_LOW_HIGH":
          return (a.averageRating || 0) - (b.averageRating || 0);
        default:
          return 0;
      }
    });

  const toggleBrand = (brand) => {
    setBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="flex gap-6">

        {/* ================= FILTER SIDEBAR ================= */}
        <aside className="hidden w-64 shrink-0 rounded-2xl bg-white p-5 shadow-sm md:block">
          <h3 className="mb-4 font-semibold">Filters</h3>

          {/* PRICE */}
          <div className="mb-6">
            <h4 className="mb-2 text-sm font-semibold">Price</h4>
            <input
              type="range"
              min="0"
              max="100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm">₹0 – ₹{maxPrice}</p>
          </div>

          {/* RATING */}
          <div className="mb-6">
            <h4 className="mb-2 text-sm font-semibold">Minimum Rating</h4>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full border rounded px-3 py-2"
            >
              <option value={0}>All</option>
              <option value={4}>4★ & above</option>
              <option value={3}>3★ & above</option>
              <option value={2}>2★ & above</option>
            </select>
          </div>

          {/* BRAND */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">Brand</h4>
            {allBrands.length === 0 && (
              <p className="text-sm text-gray-400">No brands</p>
            )}
            {allBrands.map((b) => (
              <label key={b} className="block text-sm">
                <input
                  type="checkbox"
                  checked={brands.includes(b)}
                  onChange={() => toggleBrand(b)}
                  className="mr-2"
                />
                {b}
              </label>
            ))}
          </div>
        </aside>

        {/* ================= PRODUCT SECTION ================= */}
        <main className="flex-1">

          {/* HEADER */}
          <div className="mb-5 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {categoryName || "Loading..."}
            </h2>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="FEATURED">Featured</option>
              <option value="LOW_HIGH">Price: Low to High</option>
              <option value="HIGH_LOW">Price: High to Low</option>
              <option value="RATING_HIGH_LOW">Rating: High to Low</option>
              <option value="RATING_LOW_HIGH">Rating: Low to High</option>
            </select>
          </div>

          {/* LOADING */}
          {loading && (
            <p className="text-gray-500">Loading products...</p>
          )}

          {/* EMPTY */}
          {!loading && filteredProducts.length === 0 && (
            <p className="text-gray-500">No products found</p>
          )}

          {/* GRID */}
          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}