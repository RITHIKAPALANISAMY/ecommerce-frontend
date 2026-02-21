import { useState, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";

/* ✅ CORRECT PORT */
const ORDER_API = "http://localhost:8085/api/orders";

export default function Orders() {
  const { user } = useAuth();
  const { products } = useProducts();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH BUYER ORDERS ================= */

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${ORDER_API}/buyer/${user.email.toLowerCase()}`
        );

        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  /* ================= ORDER STATS ================= */

  const orderStats = useMemo(() => {
    const delivered = orders.filter(
      (o) => o.status === "DELIVERED"
    );

    const cancelled = orders.filter(
      (o) => o.status === "CANCELLED"
    );

    const totalSpent = delivered.reduce(
      (sum, order) =>
        sum +
        order.items.reduce(
          (s, i) => s + (i.price || 0) * (i.quantity || 1),
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

    if (!result.isConfirmed) return;

    try {
      await axios.put(
        `${ORDER_API}/${orderId}/status`,
        null,
        {
          params: { status: "CANCELLED" }, // ✅ enum format
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: "CANCELLED" }
            : o
        )
      );

      Swal.fire("Cancelled!", "", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to cancel order", "error");
    }
  };

  /* ================= FILTER ================= */

  const filteredOrders = orders.filter((order) => {
    const matchSearch = order.items?.some((item) =>
      item.title?.toLowerCase().includes(search.toLowerCase())
    );

    const matchStatus =
      statusFilter === "ALL" ||
      order.status === statusFilter;

    return matchSearch && matchStatus;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        <h2 className="mb-6 text-2xl font-semibold">
          My Orders
        </h2>

        {loading && (
          <p className="text-gray-500">Loading orders...</p>
        )}

        {/* ================= STATS ================= */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Orders" value={orderStats.totalOrders} />
          <StatCard label="Delivered" value={orderStats.delivered} />
          <StatCard label="Cancelled" value={orderStats.cancelled} />
          <StatCard label="Total Spent" value={`₹${orderStats.totalSpent}`} />
        </div>

        {/* ================= SEARCH + FILTER ================= */}
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
            <option value="PLACED">Placed</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {filteredOrders.length === 0 && !loading && (
          <p className="text-center text-gray-500">
            No orders found
          </p>
        )}

        <div className="space-y-6">
          {filteredOrders.map((order) => {

            const total = order.items.reduce(
              (sum, item) =>
                sum +
                (item.price || 0) *
                  (item.quantity || 1),
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

                  <StatusBadge status={order.status} />
                </div>

                <div className="mt-4 space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-4"
                    >
                      <img
                        src={
                          item.image ||
                          products.find(
                            (p) =>
                              p.id === item.productId ||
                              p._id === item.productId
                          )?.images?.[0] ||
                          "/placeholder.png"
                        }
                        alt=""
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

                  {order.status === "PLACED" && (
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

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }) {
  const styles = {
    DELIVERED: "bg-green-100 text-green-600",
    CANCELLED: "bg-red-100 text-red-600",
    PLACED: "bg-yellow-100 text-yellow-600",
    SHIPPED: "bg-blue-100 text-blue-600",
  };

  return (
    <span
      className={`rounded px-3 py-1 text-sm font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}