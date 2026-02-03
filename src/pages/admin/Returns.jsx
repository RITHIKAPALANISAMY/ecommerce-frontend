import { useOrders } from "../../context/OrderContext";
import { useState } from "react";
import { exportToCSV } from "../../utils/exportReports";

export default function Returns() {
  const { orders, updateOrderStatus } = useOrders();
  const [processingId, setProcessingId] = useState(null);

  
  const returns = orders.filter((o) =>
    [
      "RETURN_REQUESTED",
      "RETURN_APPROVED",
      "RETURN_REJECTED",
      "RETURNED",
    ].includes(o.status)
  );

  const handleApprove = async (orderId) => {
    setProcessingId(orderId);
    try {
      await updateOrderStatus(orderId, "RETURN_APPROVED");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (orderId) => {
    setProcessingId(orderId);
    try {
      await updateOrderStatus(orderId, "RETURN_REJECTED");
    } finally {
      setProcessingId(null);
    }
  };

  
  const exportReturns = () => {
    const report = returns.map((o) => ({
      OrderID: o.id,
      Customer: o.buyerName,
      Reason: o.returnReason || "",
      Status: o.status,
      Amount: o.amount,
      Date: new Date(o.createdAt).toLocaleString(),
    }));

    exportToCSV("returns_report", report);
  };

  return (
    <div className="p-6">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Returns Management
        </h2>

        <button
          onClick={exportReturns}
          className="bg-[#931012] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
        >
          Export Returns
        </button>
      </div>

      {returns.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
          No return requests
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {returns.map((o) => {
                const pending = o.status === "RETURN_REQUESTED";

                return (
                  <tr
                    key={o.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 font-mono">#{o.id}</td>
                    <td className="p-3">{o.buyerName}</td>

                    <td className="p-3">
                      {o.returnReason || "—"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          o.status === "RETURN_APPROVED"
                            ? "bg-green-100 text-green-600"
                            : o.status === "RETURN_REJECTED"
                            ? "bg-red-100 text-red-600"
                            : o.status === "RETURN_REQUESTED"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {o.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="p-3">
                      {pending ? (
                        <div className="flex gap-3">
                          <button
                            disabled={processingId === o.id}
                            onClick={() => handleApprove(o.id)}
                            className="text-xs px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Approve
                          </button>

                          <button
                            disabled={processingId === o.id}
                            onClick={() => handleReject(o.id)}
                            className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
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