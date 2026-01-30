import { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : [];
  });

  /* ================= PERSIST ================= */
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  /* ================= PLACE ORDER (BUYER) ================= */
  const placeOrder = (order) => {
    const newOrder = {
      id: Date.now(),
      buyerId: order.buyerId,
      buyerName: order.buyerName || "Customer",
      items: order.items || [],
      address: order.address || {},
      amount: Number(order.amount) || 0, // ✅ prevents NaN
      status: "PLACED",
      createdAt: new Date().toISOString(), // ✅ analytics safe
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  /* ================= UPDATE STATUS (ADMIN / SELLER) ================= */
  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status } : o
      )
    );
  };

  /* ================= BUYER ORDERS ================= */
  const getBuyerOrders = (buyerId) => {
    return orders.filter((o) => o.buyerId === buyerId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        getBuyerOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
