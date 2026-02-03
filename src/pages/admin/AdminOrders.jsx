import { useOrders } from "../../context/OrderContext";
import { useState } from "react";
import { exportToCSV } from "../../utils/exportReports";

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [processingId, setProcessingId] = useState(null);

  
  const handleOrderAction = async (orderId, status) => {
    setProcessingId(orderId);
    try {
      updateOrderStatus(orderId, status);
    } catch (err) {
      console.error("Admin order action failed", err);
    } finally {
      setProcessingId(null);
    }
  };

 
  const exportOrders = () => {
    const report = orders.map((o) => ({
      OrderID: o.id,
      Customer: o.buyerName,
      Email: o.buyerEmail,
      TotalAmount: o.amount?.total || 0,
      Status: o.status,
      Date: new Date(o.createdAt).toLocaleString(),
    }));

    exportToCSV("orders_report", report);
  };

  return (
    <div className="p-6">
     
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Orders Management
        </h2>

        <button
          onClick={exportOrders}
          className="rounded-lg bg-[#931012] px-4 py-2 text-sm text-white hover:opacity-90"
        >
          Export Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
          No orders yet
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow">
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
                const isPlaced = o.status === "PLACED";
                const loading = processingId === o.id;

                return (
                  <tr
                    key={o.id}
                    className="border-t transition hover:bg-gray-50"
                  >
                    <td className="p-3 font-mono">
                      #{o.id}
                    </td>

                    <td className="p-3">
                      {o.buyerName}
                    </td>

                    <td className="p-3 font-semibold">
                      ₹{o.amount?.total || 0}
                    </td>

                    <td className="p-3">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          o.status === "PLACED"
                            ? "bg-yellow-100 text-yellow-700"
                            : o.status === "SHIPPED"
                            ? "bg-blue-100 text-blue-700"
                            : o.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : o.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {isPlaced ? (
                        <div className="flex gap-3">
                          <button
                            disabled={loading}
                            onClick={() =>
                              handleOrderAction(
                                o.id,
                                "SHIPPED"
                              )
                            }
                            className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            Ship
                          </button>

                          <button
                            disabled={loading}
                            onClick={() =>
                              handleOrderAction(
                                o.id,
                                "CANCELLED"
                              )
                            }
                            className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">
                          —
                        </span>
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
