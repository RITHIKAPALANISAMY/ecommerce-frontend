import { createContext, useContext, useEffect, useState } from "react";
import baseProducts from "../data/products";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  /* ================= LOAD SELLER PRODUCTS ================= */
  const [sellerProducts, setSellerProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

<<<<<<< HEAD
  /* ================= REVIEWS ================= */
=======
  /* ================= LOAD REVIEWS ================= */
>>>>>>> e757dc5c533cac1d1387b70360969ab3333de4bb
  const [reviewsMap, setReviewsMap] = useState(() => {
    const saved = localStorage.getItem("productReviews");
    return saved ? JSON.parse(saved) : {};
  });

<<<<<<< HEAD
=======
  /* ================= SAVE REVIEWS ================= */
>>>>>>> e757dc5c533cac1d1387b70360969ab3333de4bb
  useEffect(() => {
    localStorage.setItem(
      "productReviews",
      JSON.stringify(reviewsMap)
    );
  }, [reviewsMap]);

<<<<<<< HEAD
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

=======
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

>>>>>>> e757dc5c533cac1d1387b70360969ab3333de4bb
  return (
    <ProductContext.Provider
      value={{
        products,
<<<<<<< HEAD
        approveProduct,
        rejectProduct,
=======
>>>>>>> e757dc5c533cac1d1387b70360969ab3333de4bb
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
