import { useState, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

export default function Orders() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { getBuyerOrders, updateOrderStatus } = useOrders();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ================= FETCH ORDERS ================= */

  useEffect(() => {
    if (!user?.email) return;

    const buyerOrders = getBuyerOrders(user.email); // ✅ FIXED
    setOrders(buyerOrders || []);
  }, [user, getBuyerOrders]);

  /* ================= ORDER STATS ================= */

  const orderStats = useMemo(() => {
    const delivered = orders.filter(
      (o) => o.status?.toLowerCase() === "delivered"
    );

    const cancelled = orders.filter(
      (o) => o.status?.toLowerCase() === "cancelled"
    );

    const totalSpent = delivered.reduce(
      (sum, order) =>
        sum +
        order.items.reduce(
          (s, i) => s + i.price * (i.quantity || 1),
          0
        ),
      0
    );

    return {
      totalOrders: orders.length,
      delivered: delivered.length,
      cancelled: cancelled.length,
      totalSpent,
    };
  }, [orders]);

  /* ================= CANCEL ORDER ================= */

  const cancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
    });

    if (result.isConfirmed) {
      updateOrderStatus(orderId, "cancelled");

      // refresh local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: "cancelled" }
            : o
        )
      );

      Swal.fire("Cancelled!", "", "success");
    }
  };

  /* ================= FILTER ================= */

  const filteredOrders = orders.filter((order) => {
    const matchSearch = order.items.some((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

    const matchStatus =
      statusFilter === "ALL" ||
      order.status?.toLowerCase() ===
        statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        <h2 className="mb-6 text-2xl font-semibold">
          My Orders
        </h2>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Orders" value={orderStats.totalOrders} />
          <StatCard label="Delivered" value={orderStats.delivered} />
          <StatCard label="Cancelled" value={orderStats.cancelled} />
          <StatCard label="Total Spent" value={`₹${orderStats.totalSpent}`} />
        </div>

        {/* Search + Filter */}
        <div className="mb-6 flex gap-3">
          <input
            placeholder="Search orders"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border px-4 py-2 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            <option value="ALL">All</option>
            <option value="placed">Placed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500">
            No orders found
          </p>
        )}

        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const total = order.items.reduce(
              (sum, item) =>
                sum + item.price * (item.quantity || 1),
              0
            );

            return (
              <div
                key={order.id}
                className="rounded-xl bg-white p-5 shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>
                    <p className="font-medium">
                      #{order.id}
                    </p>
                  </div>

                  <span className="text-sm font-semibold capitalize">
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4"
                    >
                      <img
                        src={
                          item.image ||
                          products.find(
                            (p) => p.id === item.id
                          )?.image
                        }
                        className="h-16 w-16 rounded-lg border object-cover"
                      />

                      <div>
                        <p className="font-medium">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t pt-4">
                  <p className="font-semibold">
                    Total: ₹{total}
                  </p>

                  {order.status?.toLowerCase() ===
                    "placed" && (
                    <button
                      onClick={() =>
                        cancelOrder(order.id)
                      }
                      className="text-red-600 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold">
        {value}
      </p>
    </div>
  );
}
