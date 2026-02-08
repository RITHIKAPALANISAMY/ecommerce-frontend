import { useState, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

export default function Orders() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { getBuyerOrders, updateOrderStatus } = useOrders();

  const orders = user ? getBuyerOrders(user.id) : [];

  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openOrderId, setOpenOrderId] = useState(null);

  /* ===================== ORDER STATS ===================== */
  const orderStats = useMemo(() => {
    const totalOrders = orders.length;

    const deliveredOrders = orders.filter(
      (o) => o.status?.toLowerCase() === "delivered"
    );

    const cancelledOrders = orders.filter(
      (o) => o.status?.toLowerCase() === "cancelled"
    );

    const totalSpent = deliveredOrders.reduce((sum, order) => {
      const orderTotal = order.items.reduce(
        (s, i) => s + i.price * (i.quantity || 1),
        0
      );
      return sum + orderTotal;
    }, 0);

    return {
      totalOrders,
      delivered: deliveredOrders.length,
      cancelled: cancelledOrders.length,
      totalSpent,
    };
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("orderStats", JSON.stringify(orderStats));
  }, [orderStats]);

  /* ===================== FILTER ===================== */
  const filteredOrders = orders.filter((order) => {
    const matchSearch = order.items.some((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

    const matchStatus =
      statusFilter === "ALL" ||
      order.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  const getProductImage = (item) =>
    item.image ||
    products.find((p) => p.id === item.id)?.image ||
    "/placeholder.png";

  const canCancel = (status) =>
    !["shipped", "delivered", "cancelled"].includes(
      status?.toLowerCase()
    );

  /* ===================== CANCEL ORDER ===================== */
  const cancelOrder = (orderId) => {
    Swal.fire({
      title: "Cancel this order?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel order",
    }).then((result) => {
      if (result.isConfirmed) {
        updateOrderStatus(orderId, "Cancelled");

        Swal.fire({
          icon: "success",
          title: "Order Cancelled",
          text: "Your order has been cancelled successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  /* ===================== REVIEW ===================== */
  const submitReview = () => {
    if (!rating || !comment.trim()) return;

    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    reviews.push({
      productId: reviewModal.productId,
      userId: user.id,
      buyerName: user.username || user.name || "Verified Buyer",
      rating,
      comment,
      date: new Date().toLocaleDateString(),
      verified: true,
    });

    localStorage.setItem("reviews", JSON.stringify(reviews));

    setReviewModal(null);
    setRating(0);
    setComment("");

    Swal.fire({
  toast: true,
  position: "top-end",
  icon: "success",
  title: "Thanks for your review!",
  text: "Your feedback helps other buyers",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  background: "#ffffff",
  iconColor: "#16a34a",
  customClass: {
    popup: "rounded-xl shadow-lg border border-green-100",
    title: "text-sm font-semibold text-gray-800",
    content: "text-xs text-gray-500",
  },
});


  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        {/* STATS */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Orders" value={orderStats.totalOrders} />
          <StatCard label="Delivered" value={orderStats.delivered} color="green" />
          <StatCard label="Cancelled" value={orderStats.cancelled} color="red" />
          <StatCard
            label="Total Spent"
            value={`₹${orderStats.totalSpent}`}
            color="blue"
          />
        </div>

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            My Orders
          </h2>

          <div className="flex gap-3">
            <input
              placeholder="Search orders"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              <option value="ALL">All</option>
              <option value="Delivered">Delivered</option>
              <option value="Shipped">Shipped</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* ORDERS */}
        {filteredOrders.length === 0 && (
          <p className="mt-10 text-center text-gray-500">
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
                className="rounded-2xl border bg-white shadow-sm"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">#{order.id}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status?.toLowerCase() === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status?.toLowerCase() === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    <button
                      onClick={() =>
                        setOpenOrderId(
                          openOrderId === order.id ? null : order.id
                        )
                      }
                      className="text-sm font-medium text-gray-500"
                    >
                      {openOrderId === order.id ? "Hide" : "View"}
                    </button>
                  </div>
                </div>

                {/* DETAILS */}
                {openOrderId === order.id && (
                  <div className="border-t px-5 py-5 space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={getProductImage(item)}
                          className="h-20 w-20 rounded-xl border object-cover"
                        />

                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity || 1}
                          </p>
                          <p className="font-semibold">
                            ₹{item.price * (item.quantity || 1)}
                          </p>

                          {order.status?.toLowerCase() === "delivered" && (
                            <button
                              onClick={() =>
                                setReviewModal({
                                  productId: item.id,
                                  productTitle: item.title,
                                })
                              }
                              className="mt-2 text-sm text-red-600 hover:underline"
                            >
                              ⭐ Write a Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {canCancel(order.status) && (
                      <div className="text-right">
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t bg-gray-50 px-5 py-3 text-right font-semibold">
                  Order Total: ₹{total}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REVIEW MODAL */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">
              Review – {reviewModal.productTitle}
            </h3>

            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="mt-4 w-full rounded-lg border p-3 text-sm"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setReviewModal(null);
                  setRating(0);
                  setComment("");
                }}
                className="text-sm text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={submitReview}
                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== STAT CARD ===================== */
function StatCard({ label, value, color }) {
  const colorMap = {
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${colorMap[color] || "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}
