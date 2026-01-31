import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

export default function Orders() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { getBuyerOrders, updateOrderStatus } = useOrders();

  const orders = user ? getBuyerOrders(user.id) : [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openOrderId, setOpenOrderId] = useState(null);

  // REVIEW STATE
  const [reviewProduct, setReviewProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  /* ================= COUNTS ================= */
  const deliveredCount = orders.filter(
    o => o.status?.toLowerCase() === "delivered"
  ).length;

  const cancelledCount = orders.filter(
    o => o.status?.toLowerCase() === "cancelled"
  ).length;

  /* ================= FILTER ================= */
  const filteredOrders = orders.filter(order => {
    const matchSearch = order.items.some(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

    const matchStatus =
      statusFilter === "ALL" ||
      order.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  /* ================= IMAGE ================= */
  const getProductImage = (item) =>
    item.image ||
    products.find(p => p.id === item.productId)?.image ||
    "/placeholder.png";

  /* ================= REVIEWS ================= */
  const getReviews = () =>
    JSON.parse(localStorage.getItem("reviews") || "[]");

  const hasReviewed = (productId, orderId) => {
    const reviews = getReviews();
    return reviews.some(
      r =>
        r.productId === productId &&
        r.orderId === orderId &&
        r.userEmail === user.email
    );
  };

  const submitReview = () => {
    const reviews = getReviews();

    reviews.push({
      id: Date.now(),
      orderId: openOrderId, // ✅ IMPORTANT FIX
      productId: reviewProduct.productId,
      userEmail: user.email,
      rating,
      comment,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem("reviews", JSON.stringify(reviews));

    setReviewProduct(null);
    setRating(0);
    setComment("");
  };

  /* ================= CANCEL ================= */
  const canCancel = (status) =>
    !["shipped", "delivered", "cancelled"].includes(
      status?.toLowerCase()
    );

  const cancelOrder = (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    updateOrderStatus(orderId, "Cancelled");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-2xl font-semibold">My Orders</h2>

        {/* SUMMARY */}
        <div className="mb-6 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-xl font-bold">{orders.length}</p>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-xl font-bold text-green-600">
              {deliveredCount}
            </p>
            <p className="text-sm text-gray-500">Delivered</p>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-xl font-bold text-red-600">
              {cancelledCount}
            </p>
            <p className="text-sm text-gray-500">Cancelled</p>
          </div>
        </div>

        {/* FILTER */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            placeholder="Search your orders"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border px-4 py-2 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="ALL">All</option>
            <option value="Delivered">Delivered</option>
            <option value="Shipped">Shipped</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* ORDERS */}
        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500">
            No orders found
          </p>
        )}

        {filteredOrders.map(order => {
          const total = order.items.reduce(
            (sum, item) => sum + item.price * (item.quantity || 1),
            0
          );

          const firstItem = order.items[0];

          return (
            <div key={order.id} className="mb-4 rounded-lg bg-white shadow-sm">
              {/* COLLAPSED */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={getProductImage(firstItem)}
                    alt={firstItem.title}
                    className="h-16 w-16 rounded object-cover"
                  />

                  <div>
                    <p className="font-medium">
                      {firstItem.title}
                      {order.items.length > 1 && (
                        <span className="ml-1 text-sm text-gray-500">
                          +{order.items.length - 1} more
                        </span>
                      )}
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status?.toLowerCase() === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status?.toLowerCase() === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-semibold">₹{total}</p>
                  <button
                    onClick={() =>
                      setOpenOrderId(
                        openOrderId === order.id ? null : order.id
                      )
                    }
                  >
                    {openOrderId === order.id ? "▲" : "▼"}
                  </button>
                </div>
              </div>

              {/* EXPANDED */}
              {openOrderId === order.id && (
                <div className="border-t px-4 py-3">
                  <p className="mb-3 text-sm text-gray-600">
                    Tracking ID:{" "}
                    <strong>
                      {order.trackingId || "Will be assigned soon"}
                    </strong>
                  </p>

                  {order.items.map(item => (
                    <div
                      key={`${order.id}-${item.productId}`} // ✅ KEY FIX
                      className="mb-3 flex justify-between border-b pb-3 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity || 1}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {order.status}
                        </p>

                        {order.status === "Delivered" && (
                          hasReviewed(item.productId, order.id) ? (
                            <span className="text-sm text-green-600">
                              Reviewed ✓
                            </span>
                          ) : (
                            <button
                              onClick={() => setReviewProduct(item)}
                              className="text-sm text-red-600 hover:underline"
                            >
                              Write Review
                            </button>
                          )
                        )}
                      </div>

                      <p className="font-medium">
                        ₹{item.price * (item.quantity || 1)}
                      </p>
                    </div>
                  ))}

                  {canCancel(order.status) && (
                    <div className="text-right">
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="rounded bg-red-600 px-4 py-2 text-sm text-white"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* REVIEW MODAL */}
      {reviewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-3 text-lg font-semibold">
              Review {reviewProduct.title}
            </h3>

            <div className="mb-4 flex gap-1 text-xl">
              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  onClick={() => setRating(n)}
                  className={`cursor-pointer ${
                    n <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your experience..."
              className="mb-4 w-full rounded border px-3 py-2"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReviewProduct(null)}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>

              <button
                disabled={!rating || !comment.trim()}
                onClick={submitReview}
                className="rounded bg-red-600 px-4 py-2 text-white"
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
