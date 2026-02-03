import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

export default function Orders() {
  const navigate = useNavigate();
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

  const cancelOrder = (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    updateOrderStatus(orderId, "Cancelled");
  };

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
    alert("Review submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

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
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition focus:border-red-500 focus:outline-none"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition focus:border-red-500 focus:outline-none"
            >
              <option value="ALL">All</option>
              <option value="Delivered">Delivered</option>
              <option value="Shipped">Shipped</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* EMPTY */}
        {filteredOrders.length === 0 && (
          <p className="mt-10 text-center text-gray-500">
            No orders found
          </p>
        )}

        {/* ORDERS */}
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
                className="rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
              >
                {/* ORDER HEADER */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium text-gray-800">
                      #{order.id}
                    </p>
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
                      className="text-sm font-medium text-gray-500 transition hover:text-gray-700"
                    >
                      {openOrderId === order.id ? "Hide" : "View"}
                    </button>
                  </div>
                </div>

                {/* DETAILS */}
                {openOrderId === order.id && (
                  <div className="border-t px-5 py-5">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <img
                            src={getProductImage(item)}
                            alt={item.title}
                            className="h-20 w-20 rounded-xl object-cover border"
                          />

                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {item.title}
                            </p>

                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity || 1}
                            </p>

                            <p className="mt-1 font-semibold text-gray-800">
                              ₹ {item.price * (item.quantity || 1)}
                            </p>

                            {order.status?.toLowerCase() ===
                              "delivered" && (
                              <button
                                onClick={() =>
                                  setReviewModal({
                                    productId: item.id,
                                    productTitle: item.title,
                                  })
                                }
                                className="mt-2 text-sm font-medium text-red-600 transition hover:underline"
                              >
                                ⭐ Write a Review
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {canCancel(order.status) && (
                      <div className="mt-6 text-right">
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* FOOTER */}
                <div className="flex justify-end border-t bg-gray-50 px-5 py-3 font-semibold text-gray-800">
                  Order Total: ₹{total}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REVIEW MODAL */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800">
              Review – {reviewModal.productTitle}
            </h3>

            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl transition ${
                    star <= rating
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-300"
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
              className="mt-4 w-full rounded-lg border border-gray-300 p-3 text-sm transition focus:border-red-500 focus:outline-none"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setReviewModal(null);
                  setRating(0);
                  setComment("");
                }}
                className="text-sm font-medium text-gray-500 transition hover:text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={submitReview}
                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
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
