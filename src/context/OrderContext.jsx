import { createContext, useContext, useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  /* ================= STATE ================= */

  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : [];
  });

  /* ================= PERSIST ================= */

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  /* ================= PLACE ORDER ================= */

  const placeOrder = ({ address, amount }) => {
    if (!cartItems.length || !user?.email) return;

    const newOrder = {
      id: Date.now(),

      buyerEmail: user.email.toLowerCase(), // ✅ FIXED
      buyerName: user.name || "Customer",

      items: cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: item.quantity || 1,
        sellerId: item.sellerId,
      })),

      address: address || {},
      amount: Number(amount || 0),

      status: "placed",
      placedDate: new Date().toISOString(),
      paymentMethod: "cod",
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
  };

  /* ================= UPDATE ORDER ================= */

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: status.toLowerCase() }
          : order
      )
    );
  };

  /* ================= GET BUYER ORDERS ================= */

  const getBuyerOrders = (buyerEmail) => {
    if (!buyerEmail) return [];

    return orders.filter(
      (order) =>
        order.buyerEmail?.toLowerCase() ===
        buyerEmail.toLowerCase()
    );
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

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        getBuyerOrders,
        getSellerOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
