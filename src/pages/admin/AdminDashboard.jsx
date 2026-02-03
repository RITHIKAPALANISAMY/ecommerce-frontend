import { useMemo, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import jsPDF from "jspdf";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { useOrders } from "../../context/OrderContext";
import { useProducts } from "../../context/ProductContext";
import { useUsers } from "../../context/UserContext";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ================= HELPERS ================= */
const normalizeStatus = (status) =>
  String(status || "").toUpperCase();

const getUserName = (order, users) => {
  if (order.userName) return order.userName;

  if (order.userId) {
    const u = users.find((x) => x.id === order.userId);
    if (u?.name) return u.name;
    if (u?.email) return u.email.split("@")[0];
  }

  if (order.userEmail) return order.userEmail.split("@")[0];
  return "User";
};

const AdminDashboard = () => {
  const { orders = [] } = useOrders();
  const { products = [] } = useProducts();
  const { users = [] } = useUsers();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [, forceUpdate] = useState(0);

  /* ================= REALTIME SYNC ================= */
  useEffect(() => {
    const sync = () => forceUpdate((v) => v + 1);
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  /* ================= METRICS ================= */
  const totalSellers = useMemo(() => {
    const sellerIds = new Set(
      products.map((p) => p.sellerId).filter(Boolean)
    );
    return (
      sellerIds.size ||
      users.filter((u) => u.role === "seller").length
    );
  }, [products, users]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => {
      if (normalizeStatus(o.status) !== "DELIVERED") return sum;
      return sum + Number(o.amount?.total || 0);
    }, 0);
  }, [orders]);

  const orderStatusCounts = useMemo(() => {
    const counts = {
      PLACED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    orders.forEach((o) => {
      const s = normalizeStatus(o.status);
      if (counts[s] !== undefined) counts[s]++;
    });

    return counts;
  }, [orders]);

  /* ================= EXPORT PDF ================= */
  const exportPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Admin Dashboard Report", 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y);
    y += 10;

    doc.text(`Total Users: ${users.length}`, 14, y);
    y += 6;
    doc.text(`Total Sellers: ${totalSellers}`, 14, y);
    y += 6;
    doc.text(`Total Products: ${products.length}`, 14, y);
    y += 6;
    doc.text(`Total Orders: ${orders.length}`, 14, y);
    y += 6;
    doc.text(`Total Revenue: ₹${totalRevenue}`, 14, y);

    doc.save("admin-dashboard-report.pdf");
  };

  /* ================= UPDATE ORDER ================= */
  const updateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    localStorage.setItem("orders", JSON.stringify(updated));
    setSelectedOrder(null);
  };

  /* ================= CHART DATA ================= */
  const donutData = {
    labels: ["Placed", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [
          orderStatusCounts.PLACED,
          orderStatusCounts.SHIPPED,
          orderStatusCounts.DELIVERED,
          orderStatusCounts.CANCELLED,
        ],
        backgroundColor: [
          "#f59e0b",
          "#2563eb",
          "#16a34a",
          "#dc2626",
        ],
      },
    ],
  };

  return (
    <>
      {/* EXPORT */}
      <div className="flex justify-end mb-5">
        <button
          onClick={exportPDF}
          className="bg-[#931012] text-white px-4 py-2 rounded-lg font-medium hover:bg-red-800"
        >
          Export PDF
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          ["👥", users.length, "Total Users"],
          ["🏪", totalSellers, "Total Sellers"],
          ["📦", products.length, "Total Products"],
          ["🧾", orders.length, "Total Orders"],
          ["₹", totalRevenue, "Total Revenue"],
        ].map(([icon, value, label], i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-5 flex gap-4"
          >
            <div className="bg-red-50 p-3 rounded-xl text-xl">
              {icon}
            </div>
            <div>
              <h2 className="text-xl font-bold">{value}</h2>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* DONUT */}
      <div className="bg-white rounded-2xl shadow p-6 mt-10">
        <h3 className="font-semibold mb-4">Orders Breakdown</h3>
        <div className="h-[260px] flex justify-center">
          <Doughnut data={donutData} />
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h3 className="font-semibold mb-4">Recent Orders</h3>

        <table className="w-full text-sm">
          <thead className="text-gray-500">
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(-5).reverse().map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-2">{o.id}</td>
                <td className="p-2">{getUserName(o, users)}</td>
                <td className="p-2">₹{o.amount?.total || 0}</td>
                <td className="p-2 font-medium">
                  {normalizeStatus(o.status)}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="text-red-600 text-xs hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="font-semibold mb-3">
              Order #{selectedOrder.id}
            </h3>

            <p className="text-sm mb-2">
              User: {getUserName(selectedOrder, users)}
            </p>
            <p className="text-sm mb-2">
              Amount: ₹{selectedOrder.amount?.total || 0}
            </p>

            <label className="block text-sm font-medium mb-1">
              Update Status
            </label>
            <select
              defaultValue={normalizeStatus(selectedOrder.status)}
              onChange={(e) =>
                updateOrderStatus(
                  selectedOrder.id,
                  e.target.value
                )
              }
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option>PLACED</option>
              <option>SHIPPED</option>
              <option>DELIVERED</option>
              <option>CANCELLED</option>
            </select>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-sm px-4 py-2 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;