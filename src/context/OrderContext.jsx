import { createContext, useContext, useEffect, useState } from "react";
import { useSellerProducts } from "./SellerProductContext";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  const { restoreStockAfterCancel } = useSellerProducts();

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  /* ================= PLACE ORDER (BUYER) ================= */
  const placeOrder = (order) => {
<<<<<<< HEAD
    setOrders((prev) => [
      ...prev,
      {
        ...order,
        status: "Placed", // 🔥 FIXED
        items: order.items.map((i) => ({
          ...i,
          status: "Placed",
        })),
      },
    ]);
  };

  /* ================= UPDATE ORDER STATUS ================= */
  const updateSellerOrderStatus = (orderId, sellerId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
=======
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: "Placed",
      ...order,
    };

    setOrders((prev) => [...prev, newOrder]);
  };

  /* ================= UPDATE ORDER STATUS (SELLER) ================= */
  const updateSellerOrderStatus = (
    orderId,
    sellerId,
    newStatus
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
>>>>>>> admin-safe
        if (order.id !== orderId) return order;

        const updatedItems = order.items.map((item) =>
          item.sellerId === sellerId
            ? { ...item, status: newStatus }
            : item
        );

        return {
          ...order,
          items: updatedItems,
<<<<<<< HEAD
          status: newStatus,
=======
          status:
            newStatus === "Cancelled"
              ? "Cancelled"
              : allDelivered
              ? "Delivered"
              : "Processing",
>>>>>>> admin-safe
        };
      })
    );
  };

  /* ================= CANCEL ORDER ================= */
  const cancelOrderBySeller = (orderId, sellerId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const cancelledItems = order.items.filter(
          (i) => i.sellerId === sellerId
        );

        restoreStockAfterCancel(cancelledItems);

        return {
          ...order,
          items: order.items.map((i) =>
            i.sellerId === sellerId
              ? { ...i, status: "Cancelled" }
              : i
          ),
          status: "Cancelled",
        };
      })
    );
  };

  /* ================= SELLER HELPERS ================= */
  const getSellerOrders = (sellerId) =>
    orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (i) => i.sellerId === sellerId
        );
        if (!sellerItems.length) return null;
        return { ...order, items: sellerItems };
      })
      .filter(Boolean);

  const getSellerRevenue = (sellerId) =>
    getSellerOrders(sellerId).reduce(
      (sum, order) =>
        sum +
        order.items.reduce(
          (s, i) =>
            i.status === "Cancelled" ? s : s + i.price * i.quantity,
          0
        ),
      0
    );

  /* ================= ADMIN HELPERS ================= */
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (s, item) =>
          item.status === "Cancelled"
            ? s
            : s + item.price * item.quantity,
        0
      ),
    0
  );

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateSellerOrderStatus,
        cancelOrderBySeller,

        // seller
        getSellerOrders,
        getSellerRevenue,

        // admin
        totalOrders,
        totalRevenue,
        recentOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
