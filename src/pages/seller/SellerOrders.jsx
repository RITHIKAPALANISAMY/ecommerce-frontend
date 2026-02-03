import { useState, useMemo } from "react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import SoftStatCard from "./StatCardSoft";

export default function SellerOrders() {
  const { orders = [], updateSellerOrderStatus, cancelOrderBySeller } = useOrders();
  const { user } = useAuth();
  const sellerId = user?.email || "";

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [search, setSearch] = useState("");


  const sellerOrders = useMemo(() => {
    if (!sellerId) return [];
    return orders
      .map(o => {
        const items = o.items?.filter(i => i.sellerId === sellerId);
        return items?.length ? { ...o, items } : null;
      })
      .filter(Boolean);
  }, [orders, sellerId]);

 
  const getOrderStatus = (order) => {
    if (order.items.every(i => i.status === "Cancelled")) return "Cancelled";
    if (order.items.every(i => i.status === "Delivered")) return "Delivered";
    if (order.items.some(i => i.status === "Shipped")) return "Shipped";
    return "Placed";
  };

 
  const searchedOrders = sellerOrders
    .filter(o => statusFilter === "ALL" || getOrderStatus(o) === statusFilter)
    .filter(o =>
      String(o.id).includes(search) ||
      String(o.buyerEmail || "").toLowerCase().includes(search.toLowerCase())
    );


  const totalRevenue = searchedOrders.reduce(
    (sum, o) =>
      sum + o.items.reduce(
        (s, i) => i.status === "Cancelled" ? s : s + i.price * i.quantity,
        0
      ),
    0
  );

  const today = () => new Date().toISOString().split("T")[0];
  const expectedDelivery = () => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
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
    value={searchedOrders.filter(
      o => getOrderStatus(o) === "Delivered"
    ).length}
    type="delivered"
  />

  <SoftStatCard
    title="Cancelled"
    value={searchedOrders.filter(
      o => getOrderStatus(o) === "Cancelled"
    ).length}
    type="cancelled"
  />
</div>

      <div className="flex gap-4 mb-6">
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

      
      <div className="space-y-5">
        <AnimatePresence>
          {searchedOrders.map(order => {
            const expanded = expandedOrderId === order.id;
            const status = getOrderStatus(order);

            const totalAmount = order.items.reduce(
              (s, i) => s + i.price * i.quantity,
              0
            );

            const totalQty = order.items.reduce(
              (q, i) => q + i.quantity,
              0
            );

            return (
              <motion.div
                key={order.id}
                layout
                className="rounded-xl bg-white shadow p-5"
              >
              
                <div className="flex justify-between items-start gap-6">
                  <div>
                    <p className="font-semibold">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-500">{order.placedDate}</p>
                    <p className="text-sm text-gray-600">{order.buyerEmail}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <StatusBadge status={status} />

                    <div className="text-right min-w-[90px]">
                      <p className="font-semibold">₹{totalAmount}</p>
                      <p className="text-xs text-gray-500">Qty: {totalQty}</p>
                    </div>

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
                        className="grid grid-cols-3 gap-4 items-center"
                      >
                        <span className="font-medium">{item.title}</span>
                        <span className="text-gray-500 text-center">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-right font-medium">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}

                    <div className="mt-4 flex gap-3">
                      {status === "Placed" && (
                        <>
                          <ActionButton
                            label="Mark Shipped"
                            color="blue"
                            onClick={() =>
                              updateSellerOrderStatus(order.id, sellerId, "Shipped", {
                                shippedDate: today(),
                                expectedDelivery: expectedDelivery(),
                              })
                            }
                          />
                          <ActionButton
                            label="Cancel"
                            color="red"
                            onClick={() =>
                              cancelOrderBySeller(order.id, sellerId)
                            }
                          />
                        </>
                      )}

                      {status === "Shipped" && (
                        <ActionButton
                          label="Mark Delivered"
                          color="green"
                          onClick={() =>
                            updateSellerOrderStatus(order.id, sellerId, "Delivered", {
                              deliveredDate: today(),
                            })
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



function StatusBadge({ status }) {
  const styles = {
    Placed: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${styles[status]}`}>
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
