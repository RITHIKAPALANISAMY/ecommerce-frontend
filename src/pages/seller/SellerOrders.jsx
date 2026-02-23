import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getSellerOrders,
  updateOrderStatus,
  cancelOrder,
} from "../../api/orderApi";
import { motion, AnimatePresence } from "framer-motion";
import SoftStatCard from "./StatCardSoft";

export default function SellerOrders() {
  const { user } = useAuth();
  const sellerEmail = user?.email || "";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [search, setSearch] = useState("");

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    if (!sellerEmail) return;

    fetchOrders();
  }, [sellerEmail]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getSellerOrders(sellerEmail);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => statusFilter === "ALL" || o.status === statusFilter)
      .filter(o =>
        String(o.id).includes(search) ||
        String(o.buyerEmail || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [orders, statusFilter, search]);

  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + (o.amount || 0),
    0
  );

  /* ================= ACTION HANDLERS ================= */
  const handleStatusUpdate = async (id, status) => {
    await updateOrderStatus(id, status);
    fetchOrders();
  };

  const handleCancel = async (id) => {
    await cancelOrder(id);
    fetchOrders();
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500 animate-pulse">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <SoftStatCard title="Total Orders" value={filteredOrders.length} />
        <SoftStatCard title="Revenue" value={`₹${totalRevenue}`} />
        <SoftStatCard
          title="Delivered"
          value={filteredOrders.filter(o => o.status === "DELIVERED").length}
        />
        <SoftStatCard
          title="Cancelled"
          value={filteredOrders.filter(o => o.status === "CANCELLED").length}
        />
      </div>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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

      {/* ===== ORDERS ===== */}
      <div className="space-y-5">
        <AnimatePresence>
          {filteredOrders.map(order => {
            const expanded = expandedOrderId === order.id;

            return (
              <motion.div
                key={order.id}
                layout
                className="rounded-xl bg-white shadow hover:shadow-lg transition p-5"
              >
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <p className="font-semibold">
                      Order ID: {order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.buyerEmail}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
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
                    {order.items?.map(item => (
                      <div
                        key={item.productId}
                        className="flex justify-between"
                      >
                        <span>{item.title}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}

                    {/* ===== ACTION BUTTONS ===== */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      {order.status === "PLACED" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order.id, "SHIPPED")
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        >
                          Mark Shipped
                        </button>
                      )}

                      {order.status === "SHIPPED" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order.id, "DELIVERED")
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                        >
                          Mark Delivered
                        </button>
                      )}

                      {order.status !== "DELIVERED" &&
                        order.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                          >
                            Cancel Order
                          </button>
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

/* ===== STATUS BADGE ===== */
function StatusBadge({ status }) {
  const styles = {
    PLACED: "bg-yellow-100 text-yellow-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}