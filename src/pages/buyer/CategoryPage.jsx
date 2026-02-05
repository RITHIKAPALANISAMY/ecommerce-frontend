import { useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import ProductCard from "../../components/common/ProductCard";

export default function CategoryPage() {
  const { category } = useParams();
  const { search } = useLocation();
  const { products } = useProducts();

  const params = new URLSearchParams(search);
  const query = params.get("q") || "";

  const [sort, setSort] = useState("FEATURED");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [brands, setBrands] = useState([]);

  const categoryProducts = products.filter(
    (p) =>
      p.category &&
      p.category.toLowerCase() === category.toLowerCase()
  );

  const allBrands = [
    ...new Set(
      categoryProducts.map((p) => p.brand).filter(Boolean)
    ),
  ];

  const getProductRating = (product) => {
    const baseReviews = product.reviews || [];

    const orderReviews = JSON.parse(
      localStorage.getItem("reviews") || "[]"
    ).filter((r) => r.productId === product.id);

    const verified = [...baseReviews, ...orderReviews].filter(
      (r) => r.verified === true
    );

    if (!verified.length) return 0;

    return (
      verified.reduce(
        (sum, r) => sum + Number(r.rating || 0),
        0
      ) / verified.length
    );
  };

  const filteredProducts = categoryProducts
    .filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    )
    .filter((p) =>
      minRating === 0
        ? true
        : getProductRating(p) >= minRating
    )
    .filter((p) => p.price <= maxPrice)
    .filter((p) =>
      brands.length === 0 ? true : brands.includes(p.brand)
    )
    .sort((a, b) => {
      switch (sort) {
        case "LOW_HIGH":
          return a.price - b.price;
        case "HIGH_LOW":
          return b.price - a.price;
        case "RATING_HIGH":
          return getProductRating(b) - getProductRating(a);
        case "RATING_LOW":
          return getProductRating(a) - getProductRating(b);
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

  const clearFilters = () => {
    setMinRating(0);
    setMaxPrice(100000);
    setBrands([]);
    setSort("FEATURED");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-6 sm:px-4">
      <div className="flex gap-6">

        {/* FILTERS */}
        <aside className="hidden w-64 shrink-0 rounded-2xl bg-white p-5 shadow-sm md:block">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-red-600 transition hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* PRICE */}
          <div className="mb-6">
            <h4 className="mb-2 text-sm font-semibold text-gray-800">
              Price Range
            </h4>
            <input
              type="range"
              min="0"
              max="100000"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(Number(e.target.value))
              }
              className="w-full accent-red-600"
            />
            <p className="mt-1 text-sm text-gray-600">
              ₹0 – ₹{maxPrice}
            </p>
          </div>

          {/* RATING */}
          <div className="mb-6">
            <h4 className="mb-2 text-sm font-semibold text-gray-800">
              Customer Rating
            </h4>
            {[4, 3, 2].map((r) => (
              <label
                key={r}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(r)}
                  className="accent-red-600"
                />
                {r} ★ & above
              </label>
            ))}
          </div>

          {/* BRAND */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-800">
              Brand
            </h4>
            <div className="space-y-1">
              {allBrands.map((b) => (
                <label
                  key={b}
                  className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={brands.includes(b)}
                    onChange={() => toggleBrand(b)}
                    className="accent-red-600"
                  />
                  {b}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCTS */}
        <main className="flex-1">

          {/* HEADER */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold capitalize text-gray-800">
              {category}
            </h2>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-red-500 focus:outline-none sm:w-56"
            >
              <option value="FEATURED">Featured</option>
              <option value="LOW_HIGH">Price: Low to High</option>
              <option value="HIGH_LOW">Price: High to Low</option>
              <option value="RATING_HIGH">
                Rating: High to Low
              </option>
              <option value="RATING_LOW">
                Rating: Low to High
              </option>
            </select>
          </div>

          {/* EMPTY */}
          {filteredProducts.length === 0 && (
            <p className="text-gray-500">
              No products found
            </p>
          )}

          {/* GRID */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
