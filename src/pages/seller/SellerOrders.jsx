import { useState, useMemo } from "react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";

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

  /* ================= SELLER ORDERS ONLY ================= */
  const sellerOrders = useMemo(() => {
    if (!sellerId) return [];

    return orders
      .map((order) => {
        const items = order.items?.filter(
          (item) => item.sellerId === sellerId
        );
        return items?.length ? { ...order, items } : null;
      })
      .filter(Boolean);
  }, [orders, sellerId]);

  /* ================= FILTER ================= */
  const filteredOrders =
    statusFilter === "ALL"
      ? sellerOrders
      : sellerOrders.filter((order) => order.status === statusFilter);

  /* ================= SEARCH ================= */
  const searchedOrders = filteredOrders.filter((order) => {
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
      order.items.reduce(
        (s, i) =>
          i.status === "Cancelled"
            ? s
            : s + i.price * i.quantity,
        0
      ),
    0
  );

  const deliveredCount = searchedOrders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const cancelledCount = searchedOrders.filter(
    (o) => o.status === "Cancelled"
  ).length;

  /* ================= DATE HELPERS ================= */
  const today = () => new Date().toISOString().split("T")[0];

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

      {/* ================= PRO STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Orders"
          value={searchedOrders.length}
          icon="📦"
          from="from-indigo-500"
          to="to-indigo-700"
        />
        <StatCard
          title="Revenue"
          value={`₹${totalRevenue}`}
          icon="💰"
          from="from-emerald-500"
          to="to-emerald-700"
        />
        <StatCard
          title="Delivered"
          value={deliveredCount}
          icon="✅"
          from="from-sky-500"
          to="to-sky-700"
        />
        <StatCard
          title="Cancelled"
          value={cancelledCount}
          icon="❌"
          from="from-rose-500"
          to="to-rose-700"
        />
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border px-3 py-2"
        >
          <option value="ALL">All Orders</option>
          <option value="Placed">Placed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          type="text"
          placeholder="Search by Order ID or Buyer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2"
        />
      </div>

      {/* ================= ORDERS LIST ================= */}
      <div className="space-y-5">
        {searchedOrders.map((order) => {
          const expanded = expandedOrderId === order.id;
          const status = order.status?.toLowerCase();

          const amount = order.items.reduce(
            (s, i) =>
              i.status === "Cancelled"
                ? s
                : s + i.price * i.quantity,
            0
          );

          return (
            <div
              key={order.id}
              className="rounded-xl bg-white shadow p-5"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
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

                  <span className="font-semibold">
                    ₹{amount}
                  </span>

                  <button
                    className="text-blue-600 text-sm"
                    onClick={() =>
                      setExpandedOrderId(
                        expanded ? null : order.id
                      )
                    }
                  >
                    {expanded ? "Hide" : "View"}
                  </button>
                </div>
              </div>

              {/* ================= EXPANDED ================= */}
              {expanded && (
                <>
                  <div className="mt-4 space-y-2 text-sm">
                    {order.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between"
                      >
                        <span>{item.title}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>₹{item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* TRACKING */}
                  <div className="mt-4 text-sm text-gray-600 space-y-1">
                    {order.shippedDate && (
                      <p>📦 Shipped: {order.shippedDate}</p>
                    )}
                    {order.expectedDeliveryDate && (
                      <p>
                        🚚 Expected:{" "}
                        {order.expectedDeliveryDate}
                      </p>
                    )}
                    {order.deliveredDate && (
                      <p>✅ Delivered: {order.deliveredDate}</p>
                    )}
                    {order.cancelledDate && (
                      <p>❌ Cancelled: {order.cancelledDate}</p>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-5 flex gap-3">
                    {status === "placed" && (
                      <>
                        <ActionButton
                          color="blue"
                          label="Mark Shipped"
                          onClick={() =>
                            updateSellerOrderStatus(
                              order.id,
                              sellerId,
                              "Shipped",
                              {
                                shippedDate: today(),
                                expectedDeliveryDate:
                                  expectedDelivery(),
                              }
                            )
                          }
                        />
                        <ActionButton
                          color="red"
                          label="Cancel"
                          onClick={() =>
                            cancelOrderBySeller(
                              order.id,
                              sellerId
                            )
                          }
                        />
                      </>
                    )}

                    {status === "shipped" && (
                      <ActionButton
                        color="green"
                        label="Mark Delivered"
                        onClick={() =>
                          updateSellerOrderStatus(
                            order.id,
                            sellerId,
                            "Delivered",
                            { deliveredDate: today() }
                          )
                        }
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function StatCard({ title, value, icon, from, to }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${from} ${to} p-5 text-white shadow-lg`}
    >
      <div className="absolute right-4 top-4 text-3xl opacity-30">
        {icon}
      </div>
      <p className="text-sm uppercase tracking-wide opacity-80">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    placed: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        styles[status] || ""
      }`}
    >
      {status?.toUpperCase()}
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
