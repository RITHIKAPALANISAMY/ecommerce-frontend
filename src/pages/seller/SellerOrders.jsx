import { useState, useMemo } from "react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import SoftStatCard from "./StatCardSoft";

export default function SellerOrders() {
  const { orders = [], updateOrderStatus } = useOrders();
  const { user } = useAuth();
  const sellerEmail = user?.email || "";

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [search, setSearch] = useState("");

  /* ===== FILTER SELLER ITEMS ===== */
  const sellerOrders = useMemo(() => {
    if (!sellerEmail) return [];

    return orders
      .map(o => {
        const items = o.items?.filter(
          i => i.sellerEmail === sellerEmail
        );
        return items?.length ? { ...o, items } : null;
      })
      .filter(Boolean);
  }, [orders, sellerEmail]);

  /* ===== FILTER + SEARCH ===== */
  const searchedOrders = sellerOrders
    .filter(o => statusFilter === "ALL" || o.status === statusFilter)
    .filter(o =>
      String(o.id).includes(search) ||
      String(o.buyerEmail || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const totalRevenue = searchedOrders.reduce(
    (sum, o) =>
      sum +
      o.items.reduce(
        (s, i) => s + i.price * i.quantity,
        0
      ),
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <SoftStatCard title="Total Orders" value={searchedOrders.length} />
        <SoftStatCard title="Revenue" value={`₹${totalRevenue}`} />
        <SoftStatCard
          title="Delivered"
          value={searchedOrders.filter(o => o.status === "DELIVERED").length}
        />
        <SoftStatCard
          title="Cancelled"
          value={searchedOrders.filter(o => o.status === "CANCELLED").length}
        />
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-md border px-3 py-2"
        >
          <option value="ALL">All Orders</option>
          <option value="PLACED">Placed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <input
          placeholder="Search by Order ID or Buyer"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2"
        />
      </div>

      {/* ORDERS */}
      <div className="space-y-5">
        <AnimatePresence>
          {searchedOrders.map(order => {
            const expanded = expandedOrderId === order.id;

            return (
              <motion.div
                key={order.id}
                layout
                className="rounded-xl bg-white shadow p-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-500">
                      {order.buyerEmail}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <StatusBadge status={order.status} />

                    <button
                      onClick={() =>
                        setExpandedOrderId(expanded ? null : order.id)
                      }
                      className="text-red-600 text-sm font-medium"
                    >
                      {expanded ? "Hide" : "View"}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="mt-5 border-t pt-4 space-y-3 text-sm">
                    {order.items.map(item => (
                      <div
                        key={item.productId}
                        className="grid grid-cols-3 gap-4"
                      >
                        <span>{item.title}</span>
                        <span className="text-center">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-right">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}

                    {order.status === "PLACED" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order.id, "SHIPPED")
                        }
                        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md"
                      >
                        Mark Shipped
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PLACED: "bg-yellow-100 text-yellow-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-sm ${styles[status]}`}>
      {status}
    </span>
  );
}