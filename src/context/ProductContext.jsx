import { createContext, useContext, useEffect, useState } from "react";
import baseProducts from "../data/products";
import { useSellerProducts } from "./SellerProductContext";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const { sellerProducts } = useSellerProducts();

  /* ✅ LOAD REVIEWS FROM LOCAL STORAGE */
  const [reviewsMap, setReviewsMap] = useState(() => {
    const saved = localStorage.getItem("productReviews");
    return saved ? JSON.parse(saved) : {};
  });

  /* ✅ PERSIST REVIEWS */
  useEffect(() => {
    localStorage.setItem(
      "productReviews",
      JSON.stringify(reviewsMap)
    );
  }, [reviewsMap]);

  /* ✅ MERGE PRODUCTS + REVIEWS */
  const products = [...baseProducts, ...sellerProducts].map(
    (p) => ({
      ...p,
      reviews: reviewsMap[p.id] || [],
    })
  );

  /* ✅ ADD REVIEW */
  const addReview = (productId, review) => {
    setReviewsMap((prev) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), review],
    }));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addReview,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
