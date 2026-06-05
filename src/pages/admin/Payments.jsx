import { useEffect, useState, useMemo } from "react";
import {
  getAllPayments,
  refundPayment,
} from "../../api/paymentApi";
import { exportToCSV } from "../../utils/exportReports";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [confirmRefund, setConfirmRefund] = useState(null);
  const [page, setPage] = useState(1);

  const fetchPayments = async () => {
    try {
      const res = await getAllPayments();
      setPayments(res.data);
    } catch {
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalPages = Math.ceil(payments.length / PAGE_SIZE);

  const paginatedPayments = payments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleRefund = async () => {
    if (!confirmRefund) return;

    setProcessingId(confirmRefund);
    try {
      await refundPayment(confirmRefund);
      toast.success("Refund successful");
      fetchPayments();
    } catch {
      toast.error("Refund failed");
    } finally {
      setProcessingId(null);
      setConfirmRefund(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        Payments Management
      </h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-400">
            Loading payments...
          </div>
        ) : (
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedPayments.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{p.orderId}</td>
                  <td className="p-3">{p.userEmail}</td>
                  <td className="p-3">₹{p.amount}</td>
                  <td className="p-3">{p.paymentMethod}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.status === "SUCCESS"
                          ? "bg-green-100 text-green-600"
                          : p.status === "FAILED"
                          ? "bg-red-100 text-red-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(p.paymentTime).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {p.status === "SUCCESS" && (
                      <button
                        disabled={processingId === p.id}
                        onClick={() =>
                          setConfirmRefund(p.id)
                        }
                        className="bg-red-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2 flex-wrap">
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

      {/* Confirmation Modal */}
      {confirmRefund && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Refund
            </h3>

            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to refund this payment?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmRefund(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleRefund}
                className="px-4 py-2 bg-[#931012] text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}