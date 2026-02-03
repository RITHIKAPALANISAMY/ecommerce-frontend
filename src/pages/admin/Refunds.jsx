import { useOrders } from "../../context/OrderContext";
import { useState } from "react";
import { exportToCSV } from "../../utils/exportReports";

export default function Refunds() {
  const { orders, updateOrderStatus } = useOrders();
  const [processingId, setProcessingId] = useState(null);

  
  const refunds = orders.filter(
    (o) =>
      o.status === "REFUND_REQUESTED" ||
      o.status === "REFUNDED"
  );

  const handleRefund = async (orderId) => {
    setProcessingId(orderId);
    try {
      await updateOrderStatus(orderId, "REFUNDED");
    } catch (err) {
      console.error("Refund failed", err);
    } finally {
      setProcessingId(null);
    }
  };

  
  const exportRefunds = () => {
    const report = refunds.map((o) => ({
      OrderID: o.id,
      Customer: o.buyerName,
      Amount: o.amount,
      RefundStatus: o.status,
      PaymentMethod: o.paymentMethod || "",
      Date: new Date(o.createdAt).toLocaleString(),
    }));

    exportToCSV("refunds_report", report);
  };

  return (
    <div className="p-6">
  
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

      {refunds.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
          No refund requests
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {refunds.map((o) => (
                <tr
                  key={o.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-mono">#{o.id}</td>
                  <td className="p-3">{o.buyerName}</td>
                  <td className="p-3">₹{o.amount}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        o.status === "REFUNDED"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {o.status === "REFUNDED"
                        ? "Refunded"
                        : "Pending"}
                    </span>
                  </td>

                  <td className="p-3">
                    {o.status === "REFUND_REQUESTED" ? (
                      <button
                        disabled={processingId === o.id}
                        onClick={() => handleRefund(o.id)}
                        className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Process Refund
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}