import { useOrders } from "../../context/OrderContext";
import { useState } from "react";
import { exportToCSV } from "../../utils/exportReports";

export default function Payments() {
  const { orders, updateOrderStatus } = useOrders();
  const [processingId, setProcessingId] = useState(null);

  const payments = orders.filter(
    (o) =>
      o.paymentStatus === "PENDING" ||
      o.paymentStatus === "PAID" ||
      o.paymentStatus === "FAILED"
  );

  const markPaid = async (orderId) => {
    setProcessingId(orderId);
    try {
      await updateOrderStatus(orderId, "PAID", {
        paymentStatus: "PAID",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const markFailed = async (orderId) => {
    setProcessingId(orderId);
    try {
      await updateOrderStatus(orderId, "FAILED", {
        paymentStatus: "FAILED",
      });
    } finally {
      setProcessingId(null);
    }
  };

  
  const exportPayments = () => {
    const report = payments.map((o) => ({
      OrderID: o.id,
      Customer: o.buyerName,
      Amount: o.amount,
      PaymentMethod: o.paymentMethod || "",
      PaymentStatus: o.paymentStatus,
      OrderStatus: o.status,
      Date: new Date(o.createdAt).toLocaleString(),
    }));

    exportToCSV("payments_report", report);
  };

  return (
    <div className="p-6">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Payments Management
        </h2>

        <button
          onClick={exportPayments}
          className="bg-[#931012] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
        >
          Export Payments
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
          No payments found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Payment Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((o) => {
                const pending = o.paymentStatus === "PENDING";

                return (
                  <tr
                    key={o.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 font-mono">#{o.id}</td>
                    <td className="p-3">{o.buyerName}</td>
                    <td className="p-3">₹{o.amount}</td>

                    <td className="p-3">
                      {o.paymentMethod || "—"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          o.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-600"
                            : o.paymentStatus === "FAILED"
                            ? "bg-red-100 text-red-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>

                    <td className="p-3">
                      {pending ? (
                        <div className="flex gap-3">
                          <button
                            disabled={processingId === o.id}
                            onClick={() => markPaid(o.id)}
                            className="text-xs px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Mark Paid
                          </button>

                          <button
                            disabled={processingId === o.id}
                            onClick={() => markFailed(o.id)}
                            className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Fail
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}