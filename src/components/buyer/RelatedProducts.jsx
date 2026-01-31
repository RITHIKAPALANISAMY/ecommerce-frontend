import { useProducts } from "../../context/ProductContext";
import ProductCard from "../common/ProductCard";

export default function RelatedProducts({ currentId }) {
  const { products } = useProducts();

  const related = products
    .filter((p) => p.id !== currentId)
    .slice(0, 4);

  if (!related.length) return null;

  return (
    <section className="mt-10">
      {/* TITLE */}
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Related Products
      </h3>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {related.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
