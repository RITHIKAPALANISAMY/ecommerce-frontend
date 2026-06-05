import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();
const ORDER_API = "http://localhost:8085/api/orders";

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= SORT NEWEST FIRST ================= */

  const sortOrders = (data) => {
    if (!Array.isArray(data)) return [];

    return [...data].sort(
      (a, b) =>
        new Date(b.orderDate || b.createdAt || 0) -
        new Date(a.orderDate || a.createdAt || 0)
    );
  };

  /* ================= FETCH BUYER ORDERS ================= */

  const fetchBuyerOrders = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);

      const response = await axios.get(
        `${ORDER_API}/buyer/${user.email.toLowerCase()}`
      );

      const data = response.data?.content || response.data || [];

      setOrders(sortOrders(data));
    } catch (error) {
      console.error("Failed to fetch buyer orders:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH ADMIN ORDERS ================= */

  const fetchAllOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${ORDER_API}/admin/all`);

      const data = response.data?.content || response.data || [];

      /* 🔥 SORT LATEST FIRST */
      setOrders(sortOrders(data));
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PLACE ORDER ================= */

  const placeOrder = async (orderData) => {

  if (!orderData?.items?.length || !user?.email) {
    console.error("Order failed: Missing items or user");
    return null;
  }

  try {

    setLoading(true);

    /* ✅ FIX DISCOUNTED ITEM PRICE */

    const updatedItems = orderData.items.map((item) => ({

      ...item,

      price:
        item.finalPrice ||
        item.discountedPrice ||
        item.price

    }));

    const response = await axios.post(ORDER_API, {

      ...orderData,

      items: updatedItems,

      buyerEmail: user.email.toLowerCase(),

      buyerName: user.name || "Customer",

    });

    /* refresh orders */

    await fetchAllOrders();

    return response.data;

  } catch (error) {

    console.error("Order placement failed:", error);

    throw error;

  } finally {

    setLoading(false);

  }
};

  /* ================= UPDATE STATUS ================= */

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${ORDER_API}/${id}/status?status=${status}`);

      await fetchAllOrders();
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  /* ================= CANCEL ORDER ================= */

  const cancelOrder = async (id) => {
    try {
      await axios.delete(`${ORDER_API}/${id}`);

      await fetchBuyerOrders();
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        fetchBuyerOrders,
        fetchAllOrders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);