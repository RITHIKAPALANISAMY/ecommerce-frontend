import { useEffect, useMemo, useState } from "react";
import { useOrders } from "../../context/OrderContext";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

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
  const { orders = [], fetchAllOrders, updateOrderStatus, loading } = useOrders();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  /* 🔥 SORT NEWEST FIRST */
  const normalizedOrders = useMemo(() => {
    return [...orders]
      .map((o) => ({
        ...o,
        status: normalizeStatus(o.status),
      }))
      .sort(
        (a, b) =>
          new Date(b.orderDate || b.createdAt || 0) -
          new Date(a.orderDate || a.createdAt || 0)
      );
  }, [orders]);

  const totalPages = Math.ceil(normalizedOrders.length / PAGE_SIZE);

  const paginatedOrders = normalizedOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success(`Order marked ${status}`);
    } catch {
      toast.error("Failed to update order");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Orders Management</h2>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
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
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{order.buyerName || order.buyerEmail}</td>
                  <td className="px-6 py-4">₹{order.totalAmount}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 space-x-2">
                    {order.status === "PLACED" && (
                      <button
                        disabled={loading}
                        onClick={() => handleStatusChange(order.id, "SHIPPED")}
                        className="text-blue-600 hover:underline"
                      >
                        Mark Shipped
                      </button>
                    )}

                    {order.status === "SHIPPED" && (
                      <button
                        disabled={loading}
                        onClick={() =>
                          handleStatusChange(order.id, "DELIVERED")
                        }
                        className="text-green-600 hover:underline"
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
    </div>
  );
};

export default AdminOrders;