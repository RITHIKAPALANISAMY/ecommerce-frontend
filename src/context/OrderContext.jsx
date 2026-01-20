import { createContext, useContext, useEffect, useState } from "react";
import { useSellerProducts } from "./SellerProductContext";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  const { restoreStockAfterCancel } = useSellerProducts();

  /* ================= PERSIST ORDERS ================= */
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  /* ================= PLACE ORDER ================= */
  const placeOrder = (order) => {
    setOrders((prev) => [...prev, order]);
  };

  /* ================= UPDATE ORDER STATUS ================= */
  const updateSellerOrderStatus = (
    orderId,
    sellerId,
    newStatus
  ) => {
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
              : newStatus,
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

        // restore stock
        restoreStockAfterCancel(cancelledItems);

        const updatedItems = order.items.map((item) =>
          item.sellerId === sellerId
            ? { ...item, status: "Cancelled" }
            : item
        );

        return {
          ...order,
          items: updatedItems,
          status: "Cancelled",
        };
      })
    );
  };

  /* ================= SELLER HELPERS ================= */
  const getSellerOrders = (sellerId) => {
    return orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (item) => item.sellerId === sellerId
        );
        if (sellerItems.length === 0) return null;
        return { ...order, items: sellerItems };
      })
      .filter(Boolean);
  };

  const getSellerRevenue = (sellerId) => {
    return getSellerOrders(sellerId).reduce(
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
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateSellerOrderStatus,
        cancelOrderBySeller,
        getSellerOrders,
        getSellerRevenue,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
