import { useState, useMemo } from "react";
import { useProducts } from "../../context/ProductContext";

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const { products, loading } = useProducts();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ================= FILTER ================= */

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const totalPages = Math.ceil(
    filteredProducts.length / PAGE_SIZE
  );

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  /* ================= UI ================= */

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        Products Management
      </h2>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-4 py-2 w-full md:w-1/2"
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-6 text-gray-500">
          Loading products...
        </div>
      )}

      {/* TABLE */}
      {!loading && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-center">Stock</th>
                <th className="p-3 text-center">Category</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">
                    {p.title}
                  </td>

                  <td className="p-3 text-right">
                    ₹{p.price}
                  </td>

                  <td className="p-3 text-center">
                    {p.stock ?? "—"}
                  </td>

                  <td className="p-3 text-center">
                    {p.category ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedProducts.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No products found
            </div>
          )}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1
                    ? "bg-[#931012] text-white"
                    : ""
                }`}
              >
                {i + 1}
              </button>
            )
          )}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
