import { useOrders } from "../../context/OrderContext";
import { useState } from "react";
import { exportToCSV } from "../../utils/exportReports";

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [processingId, setProcessingId] = useState(null);

  /* ===== GENERIC ADMIN ACTION ===== */
  const handleOrderAction = async (orderId, action) => {
    setProcessingId(orderId);
    try {
      await updateOrderStatus(orderId, action);
    } catch (err) {
      console.error("Admin order action failed", err);
    } finally {
      setProcessingId(null);
    }
  };

  /* ===== EXPORT ORDERS REPORT ===== */
  const exportOrders = () => {
    const report = orders.map((o) => ({
      OrderID: o.id,
      Customer: o.buyerName,
      Amount: o.amount,
      OrderStatus: o.status,
      PaymentStatus: o.paymentStatus || "",
      PaymentMethod: o.paymentMethod || "",
      Date: new Date(o.createdAt).toLocaleString(),
    }));

    exportToCSV("orders_report", report);
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Orders Management
        </h2>

        <button
          onClick={exportOrders}
          className="bg-[#931012] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
        >
          Export Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          No orders yet
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
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => {
                const isPending = o.status === "PLACED";
                const loading = processingId === o.id;

                return (
                  <tr
                    key={o.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-mono">#{o.id}</td>
                    <td className="p-3">{o.buyerName}</td>
                    <td className="p-3">₹{o.amount}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          o.status === "PLACED"
                            ? "bg-orange-100 text-orange-600"
                            : o.status === "APPROVED"
                            ? "bg-green-100 text-green-600"
                            : o.status === "CANCELLED"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {isPending ? (
                        <div className="flex gap-3">
                          <button
                            disabled={loading}
                            onClick={() =>
                              handleOrderAction(o.id, "APPROVED")
                            }
                            className="text-xs px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Approve
                          </button>

                          <button
                            disabled={loading}
                            onClick={() =>
                              handleOrderAction(o.id, "CANCELLED")
                            }
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
};

export default AdminOrders;