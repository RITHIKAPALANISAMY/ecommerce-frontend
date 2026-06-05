import { createContext, useContext, useEffect, useState } from "react";
import {
  getUserCart,
  addToCartAPI,
  updateCartQtyAPI,
  removeCartItemAPI,
  clearCartAPI,
} from "../api/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= NORMALIZE CART ================= */
  const normalizeCart = (data) => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      id: item.id || item._id, // cart item ID
      productId: item.productId,
      productName: item.productName,
      image: item.image,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      stock: Number(item.stock) || 0,

      // 🔥 VERY IMPORTANT FIX
      sellerEmail: item.sellerEmail || item.product?.sellerEmail || null,
    }));
  };

  /* ================= LOAD CART ================= */
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await getUserCart();

      console.log("CART API RESPONSE:", res.data); // debug

      setCartItems(normalizeCart(res.data));
    } catch (err) {
      console.error("Failed to load cart", err.response?.data || err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async ({ id, quantity }) => {
    if (!user || !id) return;

    try {
      await addToCartAPI({
        productId: String(id),
        quantity: quantity || 1,
      });

      await loadCart();
    } catch (err) {
      console.error("Add to cart failed", err.response?.data || err);
    }
  };

  /* ================= INCREASE QTY ================= */
  const addQty = async (cartItemId, currentQty) => {
    try {
      await updateCartQtyAPI(cartItemId, currentQty + 1);
      await loadCart();
    } catch (err) {
      console.error("Qty update failed", err.response?.data || err);
    }
  };

  /* ================= REDUCE QTY ================= */
  const reduceQty = async (cartItemId, currentQty) => {
    if (currentQty <= 1) return;

    try {
      await updateCartQtyAPI(cartItemId, currentQty - 1);
      await loadCart();
    } catch (err) {
      console.error("Qty update failed", err.response?.data || err);
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (cartItemId) => {
    try {
      await removeCartItemAPI(cartItemId);
      await loadCart();
    } catch (err) {
      console.error("Remove failed", err.response?.data || err);
    }
  };

  /* ================= CLEAR CART ================= */
  const clearCart = async () => {
    try {
      await clearCartAPI();
      setCartItems([]);
    } catch (err) {
      console.error("Clear cart failed", err.response?.data || err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        addQty,
        reduceQty,
        removeItem,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);