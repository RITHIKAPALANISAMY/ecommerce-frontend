import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";

import {
  getBuyerOrders,
  cancelOrder,
  getBuyerStats
} from "../../api/orderApi";

import {
  ShoppingBag,
  CheckCircle,
  XCircle,
  IndianRupee
} from "lucide-react";

import { reviewApi } from "../../api/reviewApi";

export default function Orders() {

  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FILTER ================= */

  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ================= PAGINATION ================= */

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [refundModal, setRefundModal] = useState(null);
  const [refundReason, setRefundReason] = useState("");

  const fetchOrders = async () => {

    if (!user?.email) return;

    try {

      setLoading(true);

      const res = await getBuyerOrders(
        user.email.toLowerCase()
      );

      const statsRes = await getBuyerStats(
        user.email.toLowerCase()
      );

      setOrders(res?.data?.content || []);
      setStats(statsRes?.data || null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchOrders();
  }, [user?.email]);

  /* ================= RESET PAGE WHEN FILTER CHANGES ================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handleCancel = async (id) => {

    const confirm = await Swal.fire({
      title: "Cancel this order?",
      icon: "warning",
      showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    await cancelOrder(id);

    Swal.fire("Order cancelled");

    fetchOrders();

  };

  const submitReview = async () => {

    if (!reviewModal?.productId) {
      Swal.fire("Product not found");
      return;
    }

    if (!comment.trim()) {
      Swal.fire("Please write a review");
      return;
    }

    try {

      const payload = {
        productId: reviewModal.productId,
        buyerEmail: user.email.toLowerCase(),
        rating: Number(rating),
        comment: comment.trim()
      };

      await reviewApi.post("", payload);

      Swal.fire({
        icon: "success",
        title: "Review submitted"
      });

      setReviewModal(null);
      setRating(5);
      setComment("");

    } catch (err) {

      Swal.fire({
        icon: "error",
        title: "Review submission failed"
      });

    }

  };

  const requestRefund = async () => {

    if (!refundReason.trim()) {
      Swal.fire("Please enter refund reason");
      return;
    }

    try {

      await axios.put(
        `http://localhost:8085/api/orders/${refundModal.orderId}/request-refund`,
        null,
        {
          params: { reason: refundReason }
        }
      );

      Swal.fire({
        icon: "success",
        title: "Refund requested"
      });

      setRefundModal(null);
      setRefundReason("");

      fetchOrders();

    } catch (err) {

      Swal.fire("Refund request failed");

    }

  };

  const formatPrice = (v) =>
    `₹${Number(v || 0).toFixed(2)}`;

  /* ================= FILTERED ORDERS ================= */

  const filteredOrders = orders.filter((order) => {

    if (statusFilter === "ALL") return true;

    return order.status === statusFilter;

  });

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(
    filteredOrders.length / ordersPerPage
  );

  const startIndex =
    (currentPage - 1) * ordersPerPage;

  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  if (loading) {

    return (

      <div className="min-h-screen flex justify-center items-center text-xl font-semibold bg-gradient-to-br from-gray-100 to-gray-200">

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full"
        />

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 py-12 px-6">

      <div className="max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-800"
          >
            My Orders
          </motion.h2>

          {/* ================= FILTER BUTTONS ================= */}

          <div className="flex gap-3 flex-wrap">

            {[
              "ALL",
              "PLACED",
              "SHIPPED",
              "OUT_FOR_DELIVERY",
              "DELIVERED",
              "CANCELLED"
            ].map((status) => (

              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  statusFilter === status
                    ? "bg-black text-white"
                    : "bg-white border"
                }`}
              >
                {status.replaceAll("_", " ")}
              </button>

            ))}

          </div>

        </div>

        {/* ================= STATS ================= */}

        {stats && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >

            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingBag />}
            />

            <StatCard
              title="Delivered"
              value={stats.delivered}
              icon={<CheckCircle />}
            />

            <StatCard
              title="Cancelled"
              value={stats.cancelled}
              icon={<XCircle />}
            />

            <StatCard
              title="Total Spent"
              value={`₹${Number(
                stats.totalRevenue
              ).toFixed(2)}`}
              icon={<IndianRupee />}
            />

          </motion.div>

        )}

        {/* ================= EMPTY MESSAGE ================= */}

        {paginatedOrders.length === 0 ? (

          <div className="bg-white rounded-2xl p-10 text-center shadow">

            <p className="text-gray-500 text-lg">
              No {statusFilter.replaceAll("_", " ")} orders found
            </p>

          </div>

        ) : (

          paginatedOrders.map((order) => {

            const expanded =
              expandedId === order.id;

            return (

              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4 }}
                className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg mb-6 overflow-hidden"
              >

                {/* ================= ORDER HEADER ================= */}

                <div className="flex justify-between items-center p-6 border-b">

                  <div>

                    <p className="font-semibold text-lg">
                      Order #{order.id}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        order.orderDate
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div className="flex items-center gap-4">

                    <StatusBadge
                      status={order.status}
                    />

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() =>
                        setExpandedId(
                          expanded ? null : order.id
                        )
                      }
                      className="text-red-600 font-medium"
                    >
                      {expanded
                        ? "Hide"
                        : "View Details"}
                    </motion.button>

                  </div>

                </div>

                <AnimatePresence>

                  {expanded && (

                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1
                      }}
                      exit={{
                        height: 0,
                        opacity: 0
                      }}
                      transition={{
                        duration: 0.4
                      }}
                      className="p-6 space-y-6"
                    >

                      {/* ================= ITEMS ================= */}

                      {order.items?.map(
                        (item, i) => (

                          <motion.div
                            key={i}
                            initial={{
                              opacity: 0,
                              x: -10
                            }}
                            animate={{
                              opacity: 1,
                              x: 0
                            }}
                            className="flex justify-between items-center border-b pb-4"
                          >

                            <div className="flex gap-4">

                              <motion.img
                                whileHover={{
                                  scale: 1.1
                                }}
                                src={item.image}
                                className="w-20 h-20 rounded-xl object-cover border shadow"
                              />

                              <div>

                                <p className="font-semibold">
                                  {item.title}
                                </p>

                                <p className="text-sm text-gray-500">
                                  {formatPrice(
                                    item.price
                                  )}{" "}
                                  × {item.quantity}
                                </p>

                                {order.status ===
                                  "DELIVERED" && (

                                  <div className="flex gap-4 text-sm mt-1">

                                    <button
                                      onClick={() =>
                                        setReviewModal({
                                          productId:
                                            item.productId ||
                                            item.id
                                        })
                                      }
                                      className="text-green-600 hover:underline"
                                    >
                                      Write Review
                                    </button>

                                    <button
                                      onClick={() =>
                                        setRefundModal({
                                          orderId:
                                            order.id
                                        })
                                      }
                                      className="text-red-600 hover:underline"
                                    >
                                      Request Refund
                                    </button>

                                  </div>

                                )}

                              </div>

                            </div>

                            <p className="font-semibold">
                              {formatPrice(
                                item.price *
                                  item.quantity
                              )}
                            </p>

                          </motion.div>

                        )
                      )}

                      {/* ================= ADDRESS ================= */}

                      <div className="bg-gray-50 p-4 rounded-xl text-sm">

                        <p className="font-semibold mb-1">
                          Shipping Address
                        </p>

                        {order.shippingAddress
                          ?.street}
                        <br />

                        {
                          order.shippingAddress
                            ?.city
                        }
                        ,
                        {
                          order.shippingAddress
                            ?.state
                        }
                        -
                        {
                          order.shippingAddress
                            ?.pincode
                        }

                        <br />

                        <p className="mt-2 font-medium text-gray-700">
                          📞{" "}
                          {
                            order
                              .shippingAddress
                              ?.phoneNumber
                          }
                        </p>

                      </div>

                      {/* ================= TRACKING ================= */}

                      {order.trackingNumber && (

                        <div className="bg-blue-50 p-4 rounded-xl">

                          <h4 className="font-semibold text-blue-700 mb-2">
                            Shipment Details
                          </h4>

                          <div className="text-sm space-y-1">

                            <p>
                              <span className="font-medium">
                                Courier:
                              </span>{" "}
                              {
                                order.courierPartner
                              }
                            </p>

                            <p>
                              <span className="font-medium">
                                Tracking:
                              </span>{" "}
                              {
                                order.trackingNumber
                              }
                            </p>

                          </div>

                        </div>

                      )}

                      {/* ================= TIMELINE ================= */}

                      <AnimatedTimeline
                        status={order.status}
                      />

                      {/* ================= CANCEL BUTTON ================= */}

                      {order.status ===
                        "PLACED" && (

                        <motion.button
                          whileHover={{
                            scale: 1.05
                          }}
                          whileTap={{
                            scale: 0.95
                          }}
                          onClick={() =>
                            handleCancel(
                              order.id
                            )
                          }
                          className="bg-red-600 text-white px-5 py-2 rounded-lg shadow"
                        >
                          Cancel Order
                        </motion.button>

                      )}

                    </motion.div>

                  )}

                </AnimatePresence>

              </motion.div>

            );

          })

        )}

        {/* ================= PAGINATION ================= */}

        {totalPages > 1 && (

          <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.max(prev - 1, 1)
                )
              }
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl border font-medium transition ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-black hover:text-white"
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map(
              (_, index) => {

                const page = index + 1;

                return (

                  <button
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`w-10 h-10 rounded-xl font-medium transition ${
                      currentPage === page
                        ? "bg-black text-white"
                        : "bg-white border hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>

                );

              }
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    totalPages
                  )
                )
              }
              disabled={
                currentPage === totalPages
              }
              className={`px-4 py-2 rounded-xl border font-medium transition ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-black hover:text-white"
              }`}
            >
              Next
            </button>

          </div>

        )}

      </div>

      {/* ================= REVIEW MODAL ================= */}

      {reviewModal && (

        <Modal title="Write Review">

          <select
            value={rating}
            onChange={(e) =>
              setRating(
                Number(e.target.value)
              )
            }
            className="w-full border p-2 mb-4 rounded"
          >

            {[5, 4, 3, 2, 1].map((r) => (

              <option
                key={r}
                value={r}
              >
                {r} Star
              </option>

            ))}

          </select>

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            className="w-full border p-2 mb-4 rounded"
            rows={4}
          />

          <ModalButtons
            submit={submitReview}
            close={() =>
              setReviewModal(null)
            }
          />

        </Modal>

      )}

      {/* ================= REFUND MODAL ================= */}

      {refundModal && (

        <Modal title="Request Refund">

          <textarea
            value={refundReason}
            onChange={(e) =>
              setRefundReason(
                e.target.value
              )
            }
            className="w-full border p-2 mb-4 rounded"
            rows={4}
          />

          <ModalButtons
            submit={requestRefund}
            close={() =>
              setRefundModal(null)
            }
          />

        </Modal>

      )}

    </div>

  );

}

function Modal({ title, children }) {

  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
    >

      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        className="bg-white p-6 rounded-xl w-[400px] shadow-2xl"
      >

        <h3 className="font-semibold mb-4 text-lg">
          {title}
        </h3>

        {children}

      </motion.div>

    </motion.div>

  );

}

function ModalButtons({
  submit,
  close
}) {

  return (

    <div className="flex justify-end gap-3">

      <button
        onClick={close}
        className="px-3 py-2"
      >
        Cancel
      </button>

      <button
        onClick={submit}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Submit
      </button>

    </div>

  );

}

function StatusBadge({ status }) {

  const styles = {
    PLACED:
      "bg-yellow-100 text-yellow-700",
    SHIPPED:
      "bg-blue-100 text-blue-700",
    OUT_FOR_DELIVERY:
      "bg-indigo-100 text-indigo-700",
    DELIVERED:
      "bg-green-100 text-green-700",
    CANCELLED:
      "bg-red-100 text-red-700"
  };

  return (

    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}
    >
      {status?.replaceAll("_", " ")}
    </span>

  );

}

function AnimatedTimeline({
  status
}) {

  const steps = [
    "PLACED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED"
  ];

  const index =
    steps.indexOf(status);

  return (

    <div className="relative mt-6">

      <div className="absolute top-3 left-0 w-full h-2 bg-gray-200 rounded"></div>

      <motion.div
        initial={{ width: 0 }}
        animate={{
          width: `${
            (index /
              (steps.length - 1)) *
            100
          }%`
        }}
        transition={{ duration: 1 }}
        className="absolute top-3 left-0 h-2 bg-green-500 rounded"
      />

      <div className="flex justify-between relative">

        {steps.map((s, i) => (

          <div
            key={s}
            className="flex flex-col items-center text-xs"
          >

            <motion.div
              animate={{
                scale:
                  i <= index
                    ? 1.2
                    : 1
              }}
              className={`w-6 h-6 rounded-full ${
                i <= index
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />

            <span className="mt-2">
              {s.replaceAll("_", " ")}
            </span>

          </div>

        ))}

      </div>

    </div>

  );

}

function StatCard({
  title,
  value,
  icon
}) {

  return (

    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-2xl shadow-lg flex justify-between items-center border"
    >

      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p className="text-xl font-bold">
          {value}
        </p>
      </div>

      <div className="text-gray-600">
        {icon}
      </div>

    </motion.div>

  );

}