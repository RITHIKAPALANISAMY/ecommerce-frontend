import { createContext, useContext, useEffect, useState } from "react";

const SellerProductContext = createContext();

export function SellerProductProvider({ children }) {
  const [sellerProducts, setSellerProducts] = useState(() => {
    const saved = localStorage.getItem("sellerProducts");
    return saved ? JSON.parse(saved) : [];
  });

  /* SAVE TO LOCAL STORAGE */
  useEffect(() => {
    localStorage.setItem(
      "sellerProducts",
      JSON.stringify(sellerProducts)
    );
  }, [sellerProducts]);

  /* ADD PRODUCT */
  const addSellerProduct = (product) => {
    setSellerProducts((prev) => [...prev, product]);
  };

  /* DELETE PRODUCT */
  const deleteSellerProduct = (id) => {
    setSellerProducts((prev) =>
      prev.filter((p) => p.id !== id)
    );
  };

  /* EDIT PRODUCT */
  const updateSellerProduct = (updatedProduct) => {
    setSellerProducts((prev) =>
      prev.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      )
    );
  };

  /* ================= STOCK VALIDATION ================= */
  const hasSufficientStock = (items) => {
  return items.every((item) => {
    const product = sellerProducts.find(
      (p) => p.id === item.productId
    );

    // ✅ If product is NOT a seller product, ignore stock check
    if (!product) return true;

    return product.stock >= item.quantity;
  });
};


  /* ================= REDUCE STOCK ================= */
  const reduceStockAfterOrder = (items) => {
    setSellerProducts((prev) =>
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

  /* ================= RESTORE STOCK (ON CANCEL) ================= */
  const restoreStockAfterCancel = (items) => {
    setSellerProducts((prev) =>
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
