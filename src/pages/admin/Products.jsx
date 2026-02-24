import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:8082/api/products";
const PAGE_SIZE = 8;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ================= FETCH PENDING PRODUCTS ================= */
  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/pending`);
      setProducts(res.data || []);
    } catch (err) {
      toast.error("Failed to load pending products");
    } finally {
      setLoading(false);
    }
  };

  /* ================= APPROVE ================= */
  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_BASE}/admin/${id}/approve`);
      toast.success("Product approved successfully");
      fetchPendingProducts();
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  /* ================= REJECT ================= */
  const handleReject = async (id) => {
    try {
      await axios.put(`${API_BASE}/admin/${id}/reject`);
      toast.success("Product rejected");
      fetchPendingProducts();
    } catch (err) {
      toast.error("Rejection failed");
    }
  };

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  /* ================= UI ================= */

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Pending Product Approvals
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
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-[#931012]"
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-6 text-gray-500">
          Loading pending products...
        </div>
      )}

      {/* TABLE */}
      {!loading && (
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Seller</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">
                    {p.title}
                  </td>

                  <td className="p-4 text-gray-600">
                    {p.sellerEmail}
                  </td>

                  <td className="p-4 text-right font-semibold">
                    ₹{p.price}
                  </td>

                  <td className="p-4 text-center">
                    {p.stock ?? "—"}
                  </td>

                  <td className="p-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      PENDING
                    </span>
                  </td>

                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => handleApprove(p.id)}
                      className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(p.id)}
                      className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedProducts.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No pending products found
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