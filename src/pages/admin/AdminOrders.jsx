import { useMemo } from "react";
import { useOrders } from "../../context/OrderContext";

/* ===== HELPERS ===== */
const normalizeStatus = (status) =>
  String(status || "PLACED").toUpperCase();

const statusBadge = (status) => {
  switch (status) {
    case "PLACED":
      return "bg-yellow-100 text-yellow-700";
    case "SHIPPED":
      return "bg-blue-100 text-blue-700";
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const AdminOrders = () => {
  const { orders = [], updateOrderStatus } = useOrders();

  /* ===== NORMALIZED ORDERS ===== */
  const normalizedOrders = useMemo(() => {
    return orders.map((o) => ({
      ...o,
      status: normalizeStatus(o.status),
    }));
  }, [orders]);

  /* ===== ACTION HANDLERS ===== */
  const handleStatusChange = (id, status) => {
    updateOrderStatus(id, status);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Orders Management</h2>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {normalizedOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              normalizedOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-6 py-4 font-medium">
                    #{order.id}
                  </td>

                  {/* ✅ FIXED */}
                  <td className="px-6 py-4">
                    {order.buyerName || order.buyerEmail}
                  </td>

                  {/* ✅ FIXED */}
                  <td className="px-6 py-4">
                    ₹{order.amount}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {order.status === "PLACED" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order.id, "SHIPPED")
                        }
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Mark Shipped
                      </button>
                    )}

                    {order.status === "SHIPPED" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order.id, "DELIVERED")
                        }
                        className="text-green-600 font-medium hover:underline"
                      >
                        Mark Delivered
                      </button>
                    )}

                    {(order.status === "DELIVERED" ||
                      order.status === "CANCELLED") && (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;