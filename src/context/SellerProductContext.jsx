import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const SellerProductContext = createContext();

export function SellerProductProvider({ children }) {
  const { user } = useAuth();

  /* ================= LOAD FROM STORAGE ================= */
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  /* ================= SAVE TO STORAGE ================= */
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  /* ================= ADD PRODUCT ================= */
  const addSellerProduct = (product) => {
    if (!user) return;

    const newProduct = {
      ...product,
      id: Date.now(),
      sellerId: user.email, // ✅ SINGLE SOURCE OF TRUTH
    };

    setProducts((prev) => [...prev, newProduct]);
  };

  /* ================= DELETE PRODUCT ================= */
  const deleteSellerProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  /* ================= UPDATE PRODUCT ================= */
  const updateSellerProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      )
    );
  };

  /* ================= SELLER VIEW ================= */
  const sellerProducts = user
    ? products.filter((p) => p.sellerId === user.email) // ✅ FIXED
    : [];

  /* ================= BUYER VIEW ================= */
  const buyerProducts = products;

  /* ================= STOCK CHECK ================= */
  const hasSufficientStock = (items) => {
    return items.every((item) => {
      const product = products.find(
        (p) => p.id === item.productId
      );
      if (!product) return true;
      return product.stock >= item.quantity;
    });
  };

  /* ================= REDUCE STOCK ================= */
  const reduceStockAfterOrder = (items) => {
    setProducts((prev) =>
      prev.map((product) => {
        const orderedItem = items.find(
          (i) => i.productId === product.id
        );
        if (!orderedItem) return product;

        return {
          ...product,
          stock: product.stock - orderedItem.quantity,
        };
      })
    );
  };

  /* ================= RESTORE STOCK ================= */
  const restoreStockAfterCancel = (items) => {
    setProducts((prev) =>
      prev.map((product) => {
        const cancelledItem = items.find(
          (i) => i.productId === product.id
        );
        if (!cancelledItem) return product;

        return {
          ...product,
          stock: product.stock + cancelledItem.quantity,
        };
      })
    );
  };

  return (
    <SellerProductContext.Provider
      value={{
        products: buyerProducts,
        sellerProducts,
        addSellerProduct,
        deleteSellerProduct,
        updateSellerProduct,
        hasSufficientStock,
        reduceStockAfterOrder,
        restoreStockAfterCancel,
      }}
    >
      {children}
    </SellerProductContext.Provider>
  );
}

export const useSellerProducts = () =>
  useContext(SellerProductContext);
