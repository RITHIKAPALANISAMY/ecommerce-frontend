import { createContext, useContext, useEffect, useState } from "react";
import { useSellerProducts } from "./SellerProductContext";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  const { restoreStockAfterCancel } = useSellerProducts();

  /* ================= SYNC TO LOCAL STORAGE ================= */
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  /* ================= REAL-TIME SYNC (ADMIN <-> BUYER) ================= */
  useEffect(() => {
    const syncOrders = () => {
      const saved = localStorage.getItem("orders");
      setOrders(saved ? JSON.parse(saved) : []);
    };

    window.addEventListener("storage", syncOrders);
    return () => window.removeEventListener("storage", syncOrders);
  }, []);

  /* ================= PLACE ORDER (BUYER) ================= */
  const placeOrder = (order) => {
<<<<<<< HEAD
    const today = new Date().toISOString().split("T")[0];

    setOrders((prev) => [
      ...prev,
      {
        ...order,
        status: "Placed",
        placedDate: today,
        items: order.items.map((i) => ({
          ...i,
          status: "Placed",
        })),
      },
    ]);
  };

  /* ================= UPDATE ORDER STATUS ================= */
  const updateSellerOrderStatus = (
    orderId,
    sellerId,
    newStatus,
    meta = {}
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
=======
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: "Placed",
      ...order,
      items: order.items.map((item) => ({
        ...item,
        status: "Placed",
      })),
    };

    setOrders((prev) => [...prev, newOrder]);
  };

  /* ================= UPDATE ORDER STATUS (SELLER) ================= */
  const updateSellerOrderStatus = (orderId, sellerId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
>>>>>>> main
        if (order.id !== orderId) return order;

        const updatedItems = order.items.map((item) =>
          item.sellerId === sellerId
            ? { ...item, status: newStatus }
            : item
        );

        const allDelivered = updatedItems.every(
          (item) => item.status === "Delivered"
        );

        return {
          ...order,
<<<<<<< HEAD
          status: newStatus,
          ...meta, // 🔥 attach shippedDate, deliveredDate, etc
          items: updatedItems,
=======
          items: updatedItems,
          status:
            newStatus === "Cancelled"
              ? "Cancelled"
              : allDelivered
              ? "Delivered"
              : "Processing",
>>>>>>> main
        };
      })
    );
  };

  /* ================= CANCEL ORDER (SELLER) ================= */
  const cancelOrderBySeller = (orderId, sellerId) => {
<<<<<<< HEAD
    const today = new Date().toISOString().split("T")[0];

    setOrders((prev) =>
      prev.map((order) => {
=======
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
>>>>>>> main
        if (order.id !== orderId) return order;

        const cancelledItems = order.items.filter(
          (item) => item.sellerId === sellerId
        );

        restoreStockAfterCancel(cancelledItems);

        return {
          ...order,
<<<<<<< HEAD
          status: "Cancelled",
          cancelledDate: today,
          items: order.items.map((i) =>
            i.sellerId === sellerId
              ? { ...i, status: "Cancelled" }
              : i
=======
          items: order.items.map((item) =>
            item.sellerId === sellerId
              ? { ...item, status: "Cancelled" }
              : item
>>>>>>> main
          ),
        };
      })
    );
  };

  /* ================= SELLER HELPERS ================= */
  const getSellerOrders = (sellerId) =>
    orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (item) => item.sellerId === sellerId
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
<<<<<<< HEAD
          (s, i) =>
            i.status === "Cancelled"
              ? s
              : s + i.price * i.quantity,
=======
          (s, item) =>
            item.status === "Cancelled"
              ? s
              : s + item.price * item.quantity,
>>>>>>> main
          0
        ),
      0
    );

<<<<<<< HEAD
  /* ================= BUYER HELPERS (NEW – SAFE) ================= */
  const getBuyerOrders = (buyerEmail) =>
    orders.filter((o) => o.buyerEmail === buyerEmail);

 const canReviewProduct = (buyerEmail, productId) =>
  orders.some(
    (o) =>
      o.buyerEmail === buyerEmail &&
      o.items.some(
        (i) =>
          i.productId === productId &&
          i.status === "Delivered"
      )
  );

=======
  /* ================= ADMIN HELPERS (REAL-TIME) ================= */
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
>>>>>>> main

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

<<<<<<< HEAD
        // 🔥 NEW (used next)
        getBuyerOrders,
        canReviewProduct,
=======
        // admin (🔥 REAL-TIME)
        totalOrders,
        totalRevenue,
        recentOrders,
>>>>>>> main
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
