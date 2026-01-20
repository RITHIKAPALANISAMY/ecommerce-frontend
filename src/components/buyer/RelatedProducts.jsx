import { useProducts } from "../../context/ProductContext";
import ProductCard from "../common/ProductCard";

export default function RelatedProducts({ currentId }) {
  const { products } = useProducts(); // 🔥 merged products

  const related = products
    .filter((p) => p.id !== currentId)
    .slice(0, 4);

  return (
    <div className="related">
      <h3>Related Products</h3>

      <div className="related-grid">
        {related.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
