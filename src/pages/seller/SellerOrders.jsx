import { useState, useMemo } from "react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import SoftStatCard from "./StatCardSoft";

export default function SellerOrders() {
  const {
    orders = [],
    updateSellerOrderStatus,
    cancelOrderBySeller,
  } = useOrders();

  const { user } = useAuth();
  const sellerId = user?.email || "";

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [search, setSearch] = useState("");

  /* ================= SELLER ORDERS ================= */
  const sellerOrders = useMemo(() => {
    if (!sellerId) return [];

    return orders
      .map(order => {
        const items = order.items?.filter(
          i => i.sellerId === sellerId
        );
        return items?.length ? { ...order, items } : null;
      })
      .filter(Boolean);
  }, [orders, sellerId]);

  /* ================= DERIVED ORDER STATUS ================= */
  const getOrderStatus = (order) => {
    if (order.items.every(i => i.status === "Cancelled"))
      return "Cancelled";

    if (order.items.every(i => i.status === "Delivered"))
      return "Delivered";

    if (order.items.some(i => i.status === "Shipped"))
      return "Shipped";

    return "Placed";
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredOrders = sellerOrders.filter(order => {
    const status = getOrderStatus(order);
    return statusFilter === "ALL" || status === statusFilter;
  });

  const searchedOrders = filteredOrders.filter(order => {
    const q = search.toLowerCase();
    return (
      String(order.id).includes(q) ||
      String(order.buyerEmail || "").toLowerCase().includes(q)
    );
  });

  /* ================= METRICS ================= */
 const totalRevenue = searchedOrders.reduce(
  (sum, order) =>
    sum +
    order.items.reduce((s, i) => {
      if (i.status === "Cancelled") return s;

      const price = Number(i.price || 0);
      const qty = Number(i.quantity || 1);

      return s + price * qty;
    }, 0),
  0
);


  const deliveredCount = searchedOrders.filter(
    o => getOrderStatus(o) === "Delivered"
  ).length;

  const cancelledCount = searchedOrders.filter(
    o => getOrderStatus(o) === "Cancelled"
  ).length;

  /* ================= DATE HELPERS ================= */
  const today = () =>
    new Date().toISOString().split("T")[0];

  const expectedDelivery = () => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">
        My Orders
      </h2>

      {/* ================= STATS ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
      >
        <SoftStatCard
          title="Total Orders"
          value={searchedOrders.length}
          type="orders"
        />
        <SoftStatCard
          title="Revenue"
          value={`₹${totalRevenue}`}
          type="revenue"
        />
        <SoftStatCard
          title="Delivered"
          value={deliveredCount}
          type="delivered"
        />
        <SoftStatCard
          title="Cancelled"
          value={cancelledCount}
          type="cancelled"
        />
      </motion.div>

      {/* ================= FILTER ================= */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-md border px-3 py-2"
        >
          <option value="ALL">All Orders</option>
          <option value="Placed">Placed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          placeholder="Search by Order ID or Buyer"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2"
        />
      </div>

      {/* ================= ORDERS ================= */}
      <div className="space-y-5">
        <AnimatePresence>
          {searchedOrders.map(order => {
            const expanded = expandedOrderId === order.id;
            const status = getOrderStatus(order);

            const amount = order.items.reduce((sum, item) => {
  if (item.status !== "Delivered") return sum;

  const price = Number(item.price || 0);
  const qty = Number(item.quantity || 1); // ✅ DEFAULT TO 1

  return sum + price * qty;
}, 0);



            return (
              <motion.div
                key={order.id}
                layout
                className="rounded-xl bg-white shadow p-5"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">
                      Order ID: {order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.placedDate}
                    </p>
                    <p className="text-sm">
                      {order.buyerEmail}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <StatusBadge status={status} />
                    <div className="text-right">
  <p className="font-semibold">
    {amount > 0 ? `₹${amount}` : "—"}
  </p>
  <p className="text-xs text-gray-500">
    Qty: {order.items.reduce(
      (q, i) => q + Number(i.quantity || 1),
      0
    )}
  </p>
</div>

                    <button
                      onClick={() =>
                        setExpandedOrderId(
                          expanded ? null : order.id
                        )
                      }
                      className="text-red-600 text-sm"
                    >
                      {expanded ? "Hide" : "View"}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="mt-4 space-y-3 text-sm">
                    {order.items.map(item => (
                      <div
                        key={item.productId}
                        className="flex justify-between"
                      >
                        <span>{item.title}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>₹{item.price}</span>
                      </div>
                    ))}

                    <div className="flex gap-3 mt-4">
                      {status === "Placed" && (
                        <>
                          <ActionButton
                            label="Mark Shipped"
                            color="blue"
                            onClick={() =>
                              updateSellerOrderStatus(
                                order.id,
                                sellerId,
                                "Shipped",
                                {
                                  shippedDate: today(),
                                  expectedDelivery: expectedDelivery(),
                                }
                              )
                            }
                          />
                          <ActionButton
                            label="Cancel"
                            color="red"
                            onClick={() =>
                              cancelOrderBySeller(
                                order.id,
                                sellerId
                              )
                            }
                          />
                        </>
                      )}

                      {status === "Shipped" && (
                        <ActionButton
                          label="Mark Delivered"
                          color="green"
                          onClick={() =>
                            updateSellerOrderStatus(
                              order.id,
                              sellerId,
                              "Delivered",
                              {
                                deliveredDate: today(),
                              }
                            )
                          }
                        />
                      )}
                    </div>
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

/* ================= HELPERS ================= */

function StatusBadge({ status }) {
  const styles = {
    Placed: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ActionButton({ label, onClick, color }) {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm text-white ${colors[color]}`}
    >
      {label}
    </button>
  );
}
