import { useEffect, useMemo, useState } from "react";
import productApi from "../../api/productApi";
import { toast } from "react-toastify";
import { useUsers } from "../../context/UserContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PAGE_SIZE = 8;

export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("ALL");

  const { users = [] } = useUsers();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {

      setLoading(true);

      const response = await productApi.get("/api/products/admin/all");

      setProducts(response.data || []);

    } catch (error) {

      console.error("Admin fetch error:", error);

      toast.error("Failed to load products");

      setProducts([]);

    } finally {

      setLoading(false);

    }
  };

  const normalizeStatus = (status) =>
    String(status || "PENDING").toUpperCase();

  const getSellerName = (email) => {

    if (!email) return "Unknown Seller";

    const normalizedEmail = email.trim().toLowerCase();

    const seller = users.find(
      (u) => u.email?.trim().toLowerCase() === normalizedEmail
    );

    return seller?.name || seller?.username || email;

  };

  const handleApprove = async (id) => {

    try {

      await productApi.put(`/api/products/admin/${id}/approve`);

      toast.success("Product approved");

      fetchAllProducts();

    } catch (error) {

      console.error(error);

      toast.error("Approval failed");

    }

  };

  const handleReject = async (id) => {

    try {

      await productApi.put(`/api/products/admin/${id}/reject`);

      toast.success("Product rejected");

      fetchAllProducts();

    } catch (error) {

      console.error(error);

      toast.error("Rejection failed");

    }

  };
const filteredProducts = useMemo(() => {

  let data = [...products]
    .sort((a,b)=>
      new Date(b.createdAt || b.updatedAt || 0) -
      new Date(a.createdAt || a.updatedAt || 0)
    );

  if (tab !== "ALL") {
    data = data.filter((p) => {
      const status = String(p.status || "").trim().toUpperCase();
      return status === tab;
    });
  }

  if (search) {
    data = data.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }

  return data;

}, [products, search, tab]);
  const totalPages =
    filteredProducts.length > 0
      ? Math.ceil(filteredProducts.length / PAGE_SIZE)
      : 1;

  const paginatedProducts = useMemo(() => {

    const start = (page - 1) * PAGE_SIZE;

    return filteredProducts.slice(start, start + PAGE_SIZE);

  }, [filteredProducts, page]);

  const exportCSV = () => {

    const headers = ["Title", "Seller", "Price", "Stock", "Status"];

    const rows = filteredProducts.map((p) => [
      p.title,
      getSellerName(p.sellerEmail),
      p.price,
      p.stock,
      normalizeStatus(p.status),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const link = document.createElement("a");

    link.href = encodeURI(csvContent);

    link.download = "shopverse_products.csv";

    link.click();

  };

  const exportPDF = () => {

    const doc = new jsPDF();

    doc.setFillColor(147, 16, 18);

    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(18);

    doc.text("ShopVerse - Product Report", 14, 18);

    doc.setTextColor(0, 0, 0);

    doc.setFontSize(11);

    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 40);

    autoTable(doc, {
      startY: 45,
      head: [["Title", "Seller", "Price", "Stock", "Status"]],
      body: filteredProducts.map((p) => [
        p.title,
        getSellerName(p.sellerEmail),
        `₹${p.price}`,
        p.stock,
        normalizeStatus(p.status),
      ]),
    });

    doc.save("shopverse_products_report.pdf");

  };

  return (

    <div className="p-6">

      <h2 className="text-2xl font-semibold mb-6">
        Product Management
      </h2>

      <div className="flex gap-3 mb-6">

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Export CSV
        </button>

        <button
          onClick={exportPDF}
          className="px-4 py-2 bg-[#931012] text-white rounded-lg"
        >
          Export PDF
        </button>

      </div>

      <div className="flex gap-3 mb-6">

        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((t) => (

          <button
            key={t}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm ${
              tab === t
                ? "bg-[#931012] text-white"
                : "bg-gray-200"
            }`}
          >
            {t}
          </button>

        ))}

      </div>

      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border rounded-lg px-4 py-2 w-full md:w-1/2 mb-6"
      />

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

            {loading ? (

              <tr>
                <td colSpan="6" className="text-center py-6">
                  Loading...
                </td>
              </tr>

            ) : paginatedProducts.length === 0 ? (

              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No products found
                </td>
              </tr>

            ) : (

              paginatedProducts.map((p) => {

                const id = p.id || p._id;

                return (

                  <tr key={id} className="border-t hover:bg-gray-50">

                    <td className="p-4 font-medium">{p.title}</td>

                    <td className="p-4 text-gray-600">
                      {getSellerName(p.sellerEmail)}
                    </td>

                    <td className="p-4 text-right font-semibold">
                      ₹{p.price}
                    </td>

                    <td className="p-4 text-center">{p.stock}</td>

                    <td className="p-4 text-center">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          normalizeStatus(p.status) === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : normalizeStatus(p.status) === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {normalizeStatus(p.status)}
                      </span>

                    </td>

                    <td className="p-4 text-center space-x-2">

                      {normalizeStatus(p.status) === "PENDING" && (

                        <>

                          <button
                            onClick={() => handleApprove(id)}
                            className="px-3 py-1 text-xs rounded bg-green-600 text-white"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => handleReject(id)}
                            className="px-3 py-1 text-xs rounded bg-red-600 text-white"
                          >
                            Reject
                          </button>

                        </>

                      )}

                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

      {/* UPDATED PAGINATION */}

      <div className="flex justify-center mt-8 gap-2">

        {Array.from({ length: totalPages }, (_, index) => {

          const pageNumber = index + 1;

          return (

            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`w-10 h-10 rounded-md text-sm font-medium ${
                page === pageNumber
                  ? "bg-[#931012] text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {pageNumber}
            </button>

          );

        })}

      </div>

    </div>

  );
}