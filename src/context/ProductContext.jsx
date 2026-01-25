import { createContext, useContext, useEffect, useState } from "react";
import baseProducts from "../data/products";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  /* ================= LOAD SELLER PRODUCTS ================= */
  const [sellerProducts, setSellerProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  /* ================= LOAD REVIEWS ================= */
  const [reviewsMap, setReviewsMap] = useState(() => {
    const saved = localStorage.getItem("productReviews");
    return saved ? JSON.parse(saved) : {};
  });

  /* ================= SAVE REVIEWS ================= */
  useEffect(() => {
    localStorage.setItem(
      "productReviews",
      JSON.stringify(reviewsMap)
    );
  }, [reviewsMap]);

  /* ================= WATCH PRODUCTS ================= */
  useEffect(() => {
    const syncProducts = () => {
      const saved = localStorage.getItem("products");
      setSellerProducts(saved ? JSON.parse(saved) : []);
    };

    window.addEventListener("storage", syncProducts);
    return () =>
      window.removeEventListener("storage", syncProducts);
  }, []);

  /* ================= ADD REVIEW ================= */
  const addReview = (productId, review) => {
    setReviewsMap((prev) => {
      const productReviews = prev[productId] || [];

      // ❌ Prevent duplicate
      if (productReviews.some((r) => r.user === review.user)) {
        return prev;
      }

      return {
        ...prev,
        [productId]: [
          ...productReviews,
          {
            ...review,
            id: Date.now(),
            date: new Date().toLocaleDateString(),
          },
        ],
      };
    });
  };

  /* ================= EDIT REVIEW ================= */
  const editReview = (productId, reviewId, updated) => {
    setReviewsMap((prev) => ({
      ...prev,
      [productId]: prev[productId].map((r) =>
        r.id === reviewId
          ? { ...r, ...updated, edited: true }
          : r
      ),
    }));
  };

  /* ================= DELETE REVIEW ================= */
  const deleteReview = (productId, reviewId) => {
    setReviewsMap((prev) => ({
      ...prev,
      [productId]: prev[productId].filter(
        (r) => r.id !== reviewId
      ),
    }));
  };

  /* ================= MERGE PRODUCTS ================= */
  const products = [...baseProducts, ...sellerProducts].map(
    (p) => ({
      ...p,
      title: p.title || p.name || "Unnamed Product",
      images: p.images || (p.image ? [p.image] : []),
      reviews: reviewsMap[p.id] || p.reviews || [],
    })
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        addReview,
        editReview,
        deleteReview,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () =>
  useContext(ProductContext);
