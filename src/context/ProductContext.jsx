import { createContext, useContext, useEffect, useState } from "react";
import baseProducts from "../data/products";
import { useSellerProducts } from "./SellerProductContext";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const { sellerProducts } = useSellerProducts();

  /* ================= REVIEWS ================= */
  const [reviewsMap, setReviewsMap] = useState(() => {
    const saved = localStorage.getItem("productReviews");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(
      "productReviews",
      JSON.stringify(reviewsMap)
    );
  }, [reviewsMap]);

  /* ================= APPROVAL STATUS (ADMIN) ================= */
  const [approvalMap, setApprovalMap] = useState(() => {
    const saved = localStorage.getItem("productApproval");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(
      "productApproval",
      JSON.stringify(approvalMap)
    );
  }, [approvalMap]);

  /* ================= MERGED PRODUCTS ================= */
  const products = [...baseProducts, ...sellerProducts].map((p) => ({
    ...p,
    name: p.name || p.title || "Unnamed Product",
    image:
      p.image ||
      p.img ||
      p.thumbnail ||
      "https://via.placeholder.com/80",
    status: approvalMap[p.id] || p.status || "Pending",
    reviews: reviewsMap[p.id] || [],
  }));

  /* ================= ACTIONS ================= */
  const approveProduct = (id) => {
    setApprovalMap((prev) => ({
      ...prev,
      [id]: "Approved",
    }));
  };

  const rejectProduct = (id) => {
    setApprovalMap((prev) => ({
      ...prev,
      [id]: "Rejected",
    }));
  };

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
        approveProduct,
        rejectProduct,
        addReview,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
