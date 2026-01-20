import { useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import ProductCard from "../../components/common/ProductCard";
import "../../styles/categoryPage.css";

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

  /* ✅ FIX 1: case-insensitive category match */
  const categoryProducts = products.filter(
    (p) =>
      p.category &&
      p.category.toLowerCase() === category.toLowerCase()
  );

  /* ✅ FIX 2: ignore undefined brands (seller products) */
  const allBrands = [
    ...new Set(
      categoryProducts
        .map((p) => p.brand)
        .filter(Boolean)
    ),
  ];

  const filteredProducts = categoryProducts
    .filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    )
    /* ✅ FIX 3: safe rating filter */
    .filter((p) =>
      minRating === 0 ? true : (p.rating || 0) >= minRating
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
          return (b.rating || 0) - (a.rating || 0);
        case "RATING_LOW":
          return (a.rating || 0) - (b.rating || 0);
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
    <div className="category-page">
      {/* LEFT FILTERS */}
      <aside className="filters-panel">
        <div className="filters-header">
          <h3>Filters</h3>
          <button onClick={clearFilters}>Clear All</button>
        </div>

        <div className="filter-block">
          <h4>Price Range</h4>
          <input
            type="range"
            min="0"
            max="100000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
          <div className="price-values">₹0 - ₹{maxPrice}</div>
        </div>

        <div className="filter-block">
          <h4>Minimum Rating</h4>
          {[4, 3, 2].map((r) => (
            <label key={r}>
              <input
                type="radio"
                name="rating"
                onChange={() => setMinRating(r)}
              />
              {r} ★ & above
            </label>
          ))}
        </div>

        <div className="filter-block">
          <h4>Brand</h4>
          {allBrands.map((b) => (
            <label key={b}>
              <input
                type="checkbox"
                checked={brands.includes(b)}
                onChange={() => toggleBrand(b)}
              />
              {b}
            </label>
          ))}
        </div>
      </aside>

      {/* RIGHT PRODUCTS */}
      <main className="products-panel">
        <div className="products-header">
          <h2>{category}</h2>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="FEATURED">Featured</option>
            <option value="LOW_HIGH">Price: Low to High</option>
            <option value="HIGH_LOW">Price: High to Low</option>
            <option value="RATING_HIGH">Rating: High to Low</option>
            <option value="RATING_LOW">Rating: Low to High</option>
          </select>
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 && (
            <p>No products found</p>
          )}

          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
    </div>
  );
}
