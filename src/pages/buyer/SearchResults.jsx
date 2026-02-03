import { useLocation } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import ProductCard from "../../components/common/ProductCard";

export default function SearchResults() {
  const { search } = useLocation();
  const { products } = useProducts();

  const params = new URLSearchParams(search);
  const query = params.get("q") || "";
  const category = params.get("category");

  const results = products.filter((p) => {
    const matchQuery = p.title
      ?.toLowerCase()
      .includes(query.toLowerCase());

    const matchCategory = category
      ? p.category === category
      : true;

    return matchQuery && matchCategory;
  });

  return (
    <div className="bg-gray-50 px-4 py-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
  
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Search results for{" "}
            <span className="text-red-600">“{query}”</span>
          </h2>

          {category && (
            <p className="mt-1 text-sm text-gray-600">
              Category:{" "}
              <span className="font-medium text-gray-800">
                {category}
              </span>
            </p>
          )}

          <p className="mt-1 text-sm text-gray-500">
            {results.length} product
            {results.length !== 1 && "s"} found
          </p>
        </div>

        {results.length === 0 && (
          <div className="mt-10 rounded bg-white p-6 text-center shadow">
            <p className="text-gray-600 text-lg">
              No products found 😔
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try searching with a different keyword
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
