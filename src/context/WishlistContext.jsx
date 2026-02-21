import { createContext, useContext, useEffect, useState } from "react";
import wishlistService from "../services/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD FROM BACKEND ================= */

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();

      // Safety check
      setWishlist(response?.data || []);
    } catch (err) {
      console.error("Failed to load wishlist", err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD ================= */

  const addToWishlist = async (productId) => {
    try {
      await wishlistService.add(productId);
      fetchWishlist();
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  /* ================= REMOVE ================= */

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistService.remove(productId);
      fetchWishlist();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  /* ================= CHECK ================= */

  const isInWishlist = (productId) => {
    return wishlist.some(item => {
      // Case 1: backend returns productId directly
      if (item.productId) return item.productId === productId;

      // Case 2: backend returns product object
      if (item.product?.id) return item.product.id === productId;

      return false;
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
