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
      buyerEmail: order.buyerEmail,
      buyerName: order.buyerName || "Customer",

      /* 🔑 FINAL FIX: qty → quantity (SAFE) */
      items: cartItems.map(item => ({
  productId: item.id,
  title: item.title,
  price: item.price,
  image: item.image,   // 🔥 ADD THIS
  quantity: item.quantity
})),

      address: order.address || {},

      amount: {
        total: Number(order.amount?.total ?? order.amount ?? 0),
      },

      status: "Placed",
      placedDate: new Date().toISOString().split("T")[0],
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  /* ================= UPDATE STATUS ================= */
  const updateOrderStatus = (orderId, status, extra = {}) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status, ...extra } : o
      )
    );
  };

  /* ================= BUYER ORDERS ================= */
  const getBuyerOrders = (buyerId) => {
    return orders.filter((o) => o.buyerId === buyerId);
  };

  /* ================= SELLER ORDERS ================= */
  const getSellerOrders = (sellerId) => {
    return orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (item) => item.sellerId === sellerId
        );
        return sellerItems.length
          ? { ...order, items: sellerItems }
          : null;
      })
      .filter(Boolean);
  };

  /* ================= SELLER REVENUE ================= */
  const getSellerRevenue = (sellerId) => {
    return getSellerOrders(sellerId).reduce(
      (sum, order) =>
        sum +
        order.items.reduce(
          (s, i) => s + i.price * i.quantity,
          0
        ),
      0
    );
  };

  /* ================= SELLER UPDATE ITEM STATUS ================= */
  const updateSellerOrderStatus = (
    orderId,
    sellerId,
    status,
    extra = {}
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        return {
          ...order,
          status,
          ...extra,
          items: order.items.map((item) =>
            item.sellerId === sellerId
              ? { ...item, status }
              : item
          ),
        };
      })
    );
  };

  /* ================= SELLER CANCEL ================= */
  const cancelOrderBySeller = (orderId, sellerId) => {
    updateSellerOrderStatus(orderId, sellerId, "Cancelled", {
      cancelledDate: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        getBuyerOrders,
        getSellerOrders,
        getSellerRevenue,
        updateSellerOrderStatus,
        cancelOrderBySeller,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
