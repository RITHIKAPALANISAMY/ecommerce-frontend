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
      // ✅ DO NOT send email (JWT handles it)
      const res = await getUserCart();
      setCartItems(res.data || []);
    } catch (err) {
      console.error("Failed to load cart", err);
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (product) => {
    if (!user) return;

    // ✅ ONLY send required fields
    const payload = {
      productId: product.id,
      quantity: 1,
    };

    try {
      await addToCartAPI(payload);
      loadCart();
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  /* ================= INCREASE QTY ================= */
  const addQty = async (cartItemId, currentQty) => {
    try {
      await updateCartQtyAPI(cartItemId, currentQty + 1);
      loadCart();
    } catch (err) {
      console.error("Qty update failed", err);
    }
  };

  /* ================= REDUCE QTY ================= */
  const reduceQty = async (cartItemId, currentQty) => {
    if (currentQty <= 1) return;

    try {
      await updateCartQtyAPI(cartItemId, currentQty - 1);
      loadCart();
    } catch (err) {
      console.error("Qty update failed", err);
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (cartItemId) => {
    try {
      await removeCartItemAPI(cartItemId);
      loadCart();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  /* ================= CLEAR CART ================= */
  const clearCart = async () => {
    try {
      // ✅ DO NOT send email
      await clearCartAPI();
      setCartItems([]);
    } catch (err) {
      console.error("Clear cart failed", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addQty,
        reduceQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);