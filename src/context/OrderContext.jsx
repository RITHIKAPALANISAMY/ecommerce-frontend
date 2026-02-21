import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

const ORDER_API = "http://localhost:8085/api/orders";

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH BUYER ORDERS ================= */
  const fetchBuyerOrders = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${ORDER_API}/buyer/${user.email.toLowerCase()}`
      );
      setOrders(response.data || []);
    } catch (error) {
      console.error("Failed to fetch buyer orders:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PLACE ORDER ================= */
  const placeOrder = async ({ address, amount, paymentMethod, items }) => {
    if (!items?.length || !user?.email) {
      console.error("Order failed: Missing items or user");
      return null;
    }

    try {
      setLoading(true);

      const newOrder = {
        buyerEmail: user.email.toLowerCase(),
        buyerName: user.name || "Customer",
        items,
        address,
        amount,
        paymentMethod,
      };

      console.log("Sending order:", newOrder);

      const response = await axios.post(ORDER_API, newOrder);

      return response.data; // ✅ RETURN SAVED ORDER
    } catch (error) {
      console.error("Order placement failed:", error.response?.data || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        fetchBuyerOrders,
        placeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);