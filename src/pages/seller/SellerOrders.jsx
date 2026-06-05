import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import {
  Package,
  CheckCircle,
  XCircle,
  IndianRupee,
  Search
} from "lucide-react";

const ORDER_API = "http://localhost:8085/api/orders";

export default function SellerOrders() {

  const { user } = useAuth();

  const sellerEmail = user?.email?.toLowerCase();

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // ✅ FILTER + PAGINATION STATES
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 5;

  useEffect(() => {

    if (!sellerEmail) return;

    fetchOrders();
    fetchStats();

  }, [sellerEmail]);

  /* ================= FETCH ORDERS ================= */

  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        `${ORDER_API}/seller/${sellerEmail}`
      );

      // ✅ LATEST ORDERS FIRST
      const sortedOrders = (res.data || []).sort(
        (a, b) =>
          new Date(b.orderDate) - new Date(a.orderDate)
      );

      setOrders(sortedOrders);

    } catch (error) {

      console.error(error);

      toast.error("Failed to load orders");
    }
  };

  /* ================= FETCH STATS ================= */

  const fetchStats = async () => {

    try {

      const res = await axios.get(
        `${ORDER_API}/seller/${sellerEmail}/stats`
      );

      setStats(res.data);

    } catch (error) {

      console.error(error);
    }
  };

  /* ================= GENERATE SHIPMENT ================= */

  const generateShipment = async (id) => {

    try {

      await axios.put(
        `${ORDER_API}/${id}/generate-shipment`
      );

      toast.success("Shipment Generated Successfully 🚚");

      fetchOrders();
      fetchStats();

    } catch (error) {

      console.error("Shipment error:", error);

      toast.error("Shipment Failed ❌");
    }
  };

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (id, status) => {

    try {

      await axios.put(
        `${ORDER_API}/${id}/status?status=${status}`
      );

      toast.success(`Order ${status}`);

      fetchOrders();
      fetchStats();

    } catch (error) {

      console.error(error);

      toast.error("Status update failed");
    }
  };

  /* ================= FILTERED ORDERS ================= */

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      const matchesSearch =
        order.buyerEmail
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(order.id).includes(searchTerm);

      return matchesStatus && matchesSearch;
    });

  }, [orders, statusFilter, searchTerm]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(
    filteredOrders.length / ordersPerPage
  );

  const startIndex =
    (currentPage - 1) * ordersPerPage;

  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  useEffect(() => {

    setCurrentPage(1);

  }, [statusFilter, searchTerm]);

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gray-50 px-6 py-12">

        <div className="max-w-7xl mx-auto">

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-10 text-gray-800"
          >
            Seller Dashboard
          </motion.h2>

          {/* ================= STATS ================= */}

          {stats && (

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">

              <SoftStatCard
                title="Total Orders"
                value={stats.totalOrders}
                bg="bg-indigo-50"
                text="text-indigo-700"
                icon={<Package size={20} />}
              />

              <SoftStatCard
                title="Delivered"
                value={stats.delivered}
                bg="bg-green-50"
                text="text-green-700"
                icon={<CheckCircle size={20} />}
              />

              <SoftStatCard
                title="Cancelled"
                value={stats.cancelled}
                bg="bg-red-50"
                text="text-red-700"
                icon={<XCircle size={20} />}
              />

              <SoftStatCard
                title="Revenue"
                value={`₹${stats.totalRevenue.toFixed(2)}`}
                bg="bg-purple-50"
                text="text-purple-700"
                icon={<IndianRupee size={20} />}
              />

            </div>

          )}

          {/* ================= FILTER + SEARCH ================= */}

          <div className="bg-white p-5 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

            {/* SEARCH */}

            <div className="relative w-full md:w-80">

              <Search
                size={18}
                className="absolute top-3 left-3 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search order ID or buyer..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />

            </div>

            {/* FILTER BUTTONS */}

            <div className="flex flex-wrap gap-3">

              {[
                "ALL",
                "PLACED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
              ].map((status) => (

                <button
                  key={status}
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition
                  ${
                    statusFilter === status
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>

              ))}

            </div>

          </div>

          {/* ================= ORDERS ================= */}

          <h3 className="text-xl font-semibold mb-6 text-gray-700">
            Orders
          </h3>

          {currentOrders.length === 0 && (

            <div className="bg-white p-8 rounded-2xl shadow text-gray-500">
              No matching orders found.
            </div>

          )}

          {currentOrders.map((order) => {

            const expanded = expandedId === order.id;

            return (

              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md p-6 mb-8 hover:shadow-lg transition"
              >

                <div className="flex justify-between items-center flex-wrap gap-4">

                  <div>

                    <p className="font-semibold text-lg text-gray-800">
                      Order #{order.id}
                    </p>

                    <p className="text-sm text-gray-500">
                      Buyer: {order.buyerEmail}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(order.orderDate).toLocaleString()}
                    </p>

                  </div>

                  <div className="flex items-center gap-4">

                    <StatusBadge status={order.status} />

                    <button
                      onClick={() =>
                        setExpandedId(expanded ? null : order.id)
                      }
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      {expanded ? "Hide Details" : "View Details"}
                    </button>

                  </div>

                </div>

                {expanded && (

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 border-t pt-6 space-y-4"
                  >

                    {order.items
                      .filter(i => i.sellerEmail === sellerEmail)
                      .map((item) => (

                        <div
                          key={item.productId}
                          className="flex justify-between items-center border-b pb-4"
                        >

                          <div className="flex items-center gap-4">

                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 rounded-lg object-cover border"
                            />

                            <div>

                              <p className="font-medium text-gray-800">
                                {item.title}
                              </p>

                              <p className="text-sm text-gray-500">
                                ₹{item.price} × {item.quantity}
                              </p>

                            </div>

                          </div>

                          <span className="font-semibold text-gray-800">
                            ₹{item.price * item.quantity}
                          </span>

                        </div>

                      ))}

                    {/* ADDRESS */}

                    <div className="bg-gray-50 p-4 rounded-xl text-sm mt-4">

                      <p className="font-semibold mb-2">
                        Customer Delivery Address
                      </p>

                      <p>
                        {order.shippingAddress?.street}
                      </p>

                      <p>
                        {order.shippingAddress?.city},
                        {" "}
                        {order.shippingAddress?.state}
                        {" - "}
                        {order.shippingAddress?.pincode}
                      </p>

                      <p className="mt-3 font-medium text-gray-700">
                        📞 {order.shippingAddress?.phoneNumber}
                      </p>

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="flex gap-4 mt-4 flex-wrap">

                      {order.status === "PLACED" && (

                        <ActionButton
                          label="Generate Shipment"
                          color="bg-blue-600 hover:bg-blue-700"
                          onClick={() =>
                            generateShipment(order.id)
                          }
                        />

                      )}

                      {order.status === "SHIPPED" && (

                        <ActionButton
                          label="Mark Delivered"
                          color="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            updateStatus(order.id, "DELIVERED")
                          }
                        />

                      )}

                      {order.status !== "DELIVERED" &&
                        order.status !== "CANCELLED" && (

                          <ActionButton
                            label="Cancel"
                            color="bg-red-600 hover:bg-red-700"
                            onClick={() =>
                              updateStatus(order.id, "CANCELLED")
                            }
                          />

                        )}

                    </div>

                  </motion.div>

                )}

              </motion.div>

            );

          })}

          {/* ================= PAGINATION ================= */}

          {totalPages > 1 && (

            <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(prev => prev - 1)
                }
                className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (

                <button
                  key={index}
                  onClick={() =>
                    setCurrentPage(index + 1)
                  }
                  className={`px-4 py-2 rounded-lg font-medium
                  ${
                    currentPage === index + 1
                      ? "bg-red-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>

              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage(prev => prev + 1)
                }
                className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>

            </div>

          )}

        </div>

      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function SoftStatCard({ title, value, bg, text, icon }) {

  return (

    <motion.div
      whileHover={{ scale: 1.04 }}
      className={`p-6 rounded-2xl shadow-md ${bg} transition`}
    >

      <div className="flex justify-between items-start">

        <div>

          <p className="text-sm text-gray-500 mb-2">
            {title}
          </p>

          <p className={`text-2xl font-bold ${text}`}>
            {value}
          </p>

        </div>

        <div className={`${text} opacity-80`}>
          {icon}
        </div>

      </div>

    </motion.div>

  );
}

function ActionButton({ label, color, onClick }) {

  return (

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${color} text-white px-5 py-2 rounded-lg text-sm transition`}
    >
      {label}
    </motion.button>

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

    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>

  );
}