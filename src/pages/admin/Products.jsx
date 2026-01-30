import { useState, useMemo } from "react";
import { useProducts } from "../../context/ProductContext";

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const {
    products,
    approveProduct,
    rejectProduct,
    flagProduct,
    unflagProduct,
  } = useProducts();

  /* ================= SEARCH, FILTER, PAGINATION ================= */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const status = p.status?.toUpperCase();
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sellerId || "Seller")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "FLAGGED" && p.flagged) ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const totalPages = Math.ceil(
    filteredProducts.length / PAGE_SIZE
  );

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);
  /* =============================================================== */

  const statusBadge = (status) => {
    if (status === "APPROVED")
      return "bg-green-100 text-green-700";
    if (status === "REJECTED")
      return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        Products Management
      </h2>

      {/* ===== SEARCH & FILTER ===== */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search product or seller..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-4 py-2 w-full md:w-1/2"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-4 py-2 w-full md:w-1/4"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="FLAGGED">Flagged</option>
        </select>
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Seller</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Risk</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((p) => {
              const status = p.status?.toUpperCase();

              return (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">
                    {p.name}
                  </td>
                  <td className="p-3">
                    {p.sellerId || "Seller"}
                  </td>
                  <td className="p-3 text-right">
                    ₹{p.price}
                  </td>
                  <td className="p-3 text-center">
                    {p.stock ?? "—"}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    {p.flagged ? (
                      <span className="text-red-600 font-medium">
                        🚩 Flagged
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">
                        Safe
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      {status === "PENDING" ? (
                        <>
                          <button
                            onClick={() =>
                              approveProduct(p.id)
                            }
                            className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              rejectProduct(p.id)
                            }
                            className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            p.flagged
                              ? unflagProduct(p.id)
                              : flagProduct(p.id)
                          }
                          className="px-3 py-1 text-xs rounded bg-orange-500 text-white hover:bg-orange-600"
                        >
                          {p.flagged ? "Unflag" : "Flag"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {paginatedProducts.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No products found
          </div>
        )}
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
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
          ))}

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