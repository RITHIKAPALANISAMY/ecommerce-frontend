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

  /* ================= PLACE ORDER ================= */
  const placeOrder = (order) => {
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
        if (order.id !== orderId) return order;

        const updatedItems = order.items.map((item) =>
          item.sellerId === sellerId
            ? { ...item, status: newStatus }
            : item
        );

        return {
          ...order,
          items: updatedItems,
          status: newStatus,
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
