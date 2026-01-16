import { useLocation } from "react-router-dom";
import products from "../../data/products";
import ProductCard from "../../components/common/ProductCard";

export default function SearchResults() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const query = params.get("q") || "";
  const category = params.get("category");

  const results = products.filter((p) => {
    const matchQuery = p.title.toLowerCase().includes(query.toLowerCase());
    const matchCategory = category ? p.category === category : true;
    return matchQuery && matchCategory;
  });

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Search results for "<em>{query}</em>"
        {category && <> in <strong>{category}</strong></>}
      </h2>

      {results.length === 0 && (
        <p style={{ marginTop: 20 }}>No products found</p>
      )}

      <div className="product-grid" style={{ marginTop: 20 }}>
        {results.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
