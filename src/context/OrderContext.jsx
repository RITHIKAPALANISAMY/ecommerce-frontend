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
          items: updatedItems,
          status:
            newStatus === "Cancelled"
              ? "Cancelled"
              : allDelivered
              ? "Delivered"
              : "Processing",
        };
      })
    );
  };

  /* ================= CANCEL ORDER (SELLER) ================= */
  const cancelOrderBySeller = (orderId, sellerId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== orderId) return order;

        const cancelledItems = order.items.filter(
          (item) => item.sellerId === sellerId
        );

        restoreStockAfterCancel(cancelledItems);

        return {
          ...order,
          items: order.items.map((item) =>
            item.sellerId === sellerId
              ? { ...item, status: "Cancelled" }
              : item
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
          (s, item) =>
            item.status === "Cancelled"
              ? s
              : s + item.price * item.quantity,
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
