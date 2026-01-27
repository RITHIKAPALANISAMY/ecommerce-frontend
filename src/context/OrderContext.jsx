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
        if (order.id !== orderId) return order;

        const updatedItems = order.items.map((item) =>
          item.sellerId === sellerId
            ? { ...item, status: newStatus }
            : item
        );

        return {
          ...order,
          status: newStatus,
          ...meta, // 🔥 attach shippedDate, deliveredDate, etc
          items: updatedItems,
        };
      })
    );
  };

  /* ================= CANCEL ORDER ================= */
  const cancelOrderBySeller = (orderId, sellerId) => {
    const today = new Date().toISOString().split("T")[0];

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const cancelledItems = order.items.filter(
          (i) => i.sellerId === sellerId
        );

        restoreStockAfterCancel(cancelledItems);

        return {
          ...order,
          status: "Cancelled",
          cancelledDate: today,
          items: order.items.map((i) =>
            i.sellerId === sellerId
              ? { ...i, status: "Cancelled" }
              : i
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
            i.status === "Cancelled"
              ? s
              : s + i.price * i.quantity,
          0
        ),
      0
    );

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


  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateSellerOrderStatus,
        cancelOrderBySeller,
        getSellerOrders,
        getSellerRevenue,

        // 🔥 NEW (used next)
        getBuyerOrders,
        canReviewProduct,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
