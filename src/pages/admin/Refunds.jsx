import { useEffect, useState } from "react";
import { getAllPayments } from "../../api/paymentApi";
import { exportToCSV } from "../../utils/exportReports";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

export default function Refunds() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  /* ================= FETCH PAYMENTS ================= */

  const fetchPayments = async () => {
    try {
      const res = await getAllPayments();
      setPayments(res.data);
    } catch (err) {
      toast.error("Failed to load refunds");
    } finally {
      setLoading(false);
    }
  };

  /* ================= AUTO REFRESH ================= */

  useEffect(() => {
    fetchPayments();

    const interval = setInterval(() => {
      fetchPayments();
    }, 10000); // refresh every 10 sec

    return () => clearInterval(interval);
  }, []);

  /* ================= FILTER REFUNDS ================= */

  const refunds = payments.filter(
    (p) =>
      p.status === "REFUND_PROCESSING" ||
      p.status === "REFUNDED"
  );

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(refunds.length / PAGE_SIZE);

  const paginatedRefunds = refunds.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= FORMAT DATE ================= */

  const formatDate = (date) => {
   if (!date) return "Not Recorded";

    const parsed = new Date(date);
    return isNaN(parsed)
      ? "Pending"
      : parsed.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
  };

  /* ================= EXPORT ================= */

  const exportRefunds = () => {
    const report = refunds.map((p) => ({
      OrderID: p.orderId,
      User: p.userEmail,
      Amount: p.amount,
      Status: p.status,
      RefundID: p.razorpayRefundId || "",
      RefundTime: formatDate(p.refundTime),
    }));

    exportToCSV("refunds_report", report);
  };

  /* ================= STATUS BADGE ================= */

  const getStatusStyle = (status) => {
    switch (status) {
      case "REFUND_PROCESSING":
        return "bg-yellow-100 text-yellow-600";
      case "REFUNDED":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Refund Management
        </h2>

        <button
          onClick={exportRefunds}
          className="bg-[#931012] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
        >
          Export Refunds
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        {loading ? (
          <div className="p-6 text-center text-gray-400">
            Loading refunds...
          </div>
        ) : refunds.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No refunds found
          </div>
        ) : (
          <>
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Refund Details</th>
                </tr>
              </thead>

              <tbody>
                {paginatedRefunds.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 font-mono">
                      {p.orderId}
                    </td>

                    <td className="p-3">
                      {p.userEmail}
                    </td>

                    <td className="p-3 font-semibold">
                      ₹{p.amount}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(
                          p.status
                        )}`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="p-3 text-xs space-y-1">
                      <div>
                        <span className="text-gray-500">
                          Refund ID:
                        </span>{" "}
                        <span className="font-medium">
                          {p.razorpayRefundId || "—"}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-500">
                          Processed:
                        </span>{" "}
                        <span className="font-medium">
                          {formatDate(p.refundTime)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2 p-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      page === i + 1
                        ? "bg-[#931012] text-white"
                        : "border hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}