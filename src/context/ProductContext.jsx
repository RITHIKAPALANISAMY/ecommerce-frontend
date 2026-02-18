import { createContext, useContext, useEffect, useState } from "react";
import baseProducts from "../data/products";

const ProductContext = createContext();

/* ================= HELPERS ================= */
const loadLS = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export function ProductProvider({ children }) {
  /* ================= SELLER PRODUCTS ================= */
  const [sellerProducts, setSellerProducts] = useState(() =>
    loadLS("products", [])
  );

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(sellerProducts));
  }, [sellerProducts]);

  /* ================= REVIEWS ================= */
  const [reviewsMap, setReviewsMap] = useState(() =>
    loadLS("productReviews", {})
  );

  useEffect(() => {
    localStorage.setItem("productReviews", JSON.stringify(reviewsMap));
  }, [reviewsMap]);

  /* ================= APPROVAL ================= */
  const [approvalMap, setApprovalMap] = useState(() =>
    loadLS("productApproval", {})
  );

  useEffect(() => {
    localStorage.setItem("productApproval", JSON.stringify(approvalMap));
  }, [approvalMap]);

  /* ================= FLAGS ================= */
  const [flagMap, setFlagMap] = useState(() =>
    loadLS("productFlags", {})
  );

  useEffect(() => {
    localStorage.setItem("productFlags", JSON.stringify(flagMap));
  }, [flagMap]);

  /* ================= STOCK ================= */
  const [stockMap, setStockMap] = useState(() =>
    loadLS("productStock", {})
  );

  useEffect(() => {
    localStorage.setItem("productStock", JSON.stringify(stockMap));
  }, [stockMap]);

  /* ================= MERGED PRODUCTS ================= */
  const products = [...baseProducts, ...sellerProducts].map((p) => ({
    ...p,
    name: p.name || p.title || "Unnamed Product",
    image:
      p.image ||
      p.img ||
      p.thumbnail ||
      "https://via.placeholder.com/80",
    status: approvalMap[p.id] ?? p.status ?? "Pending",
    reviews: reviewsMap[p.id] || [],
    flagged: flagMap[p.id] || false,
    stock: stockMap[p.id] ?? p.stock ?? 10,
  }));

  /* ================= ADMIN ACTIONS ================= */
  const approveProduct = (id) =>
    setApprovalMap((prev) => ({ ...prev, [id]: "Approved" }));

  const rejectProduct = (id) =>
    setApprovalMap((prev) => ({ ...prev, [id]: "Rejected" }));

  const flagProduct = (id) =>
    setFlagMap((prev) => ({ ...prev, [id]: true }));

  const unflagProduct = (id) =>
    setFlagMap((prev) => ({ ...prev, [id]: false }));

  /* ================= REVIEW ACTIONS ================= */
  const addReview = (productId, review) => {
    setReviewsMap((prev) => {
      const existing = prev[productId] || [];

      if (existing.some((r) => r.user === review.user)) {
        return prev;
      }

      return {
        ...prev,
        [productId]: [
          ...existing,
          {
            ...review,
            id: Date.now(),
            date: new Date().toLocaleDateString(),
          },
        ],
      };
    });
  };

  const editReview = (productId, reviewId, updated) => {
    setReviewsMap((prev) => ({
      ...prev,
      [productId]: (prev[productId] || []).map((r) =>
        r.id === reviewId ? { ...r, ...updated, edited: true } : r
      ),
    }));
  };

  const deleteReview = (productId, reviewId) => {
    setReviewsMap((prev) => ({
      ...prev,
      [productId]: (prev[productId] || []).filter(
        (r) => r.id !== reviewId
      ),
    }));
  };

  /* ================= STOCK HELPERS ================= */
  const reduceStock = (items) => {
    setStockMap((prev) => {
      const updated = { ...prev };

      items.forEach((item) => {
        const current = updated[item.productId] ?? item.stock ?? 10;
        updated[item.productId] = Math.max(
          0,
          current - item.quantity
        );
      });

      return updated;
    });
  };

  const restoreStockAfterCancel = (items) => {
    setStockMap((prev) => {
      const updated = { ...prev };

      items.forEach((item) => {
        updated[item.productId] =
          (updated[item.productId] ?? 0) + item.quantity;
      });

      return updated;
    });
  };

  /* ================= MULTI-TAB SYNC ================= */
  useEffect(() => {
    const syncAll = () => {
      setSellerProducts(loadLS("products", []));
      setReviewsMap(loadLS("productReviews", {}));
      setApprovalMap(loadLS("productApproval", {}));
      setFlagMap(loadLS("productFlags", {}));
      setStockMap(loadLS("productStock", {}));
    };

    window.addEventListener("storage", syncAll);
    return () => window.removeEventListener("storage", syncAll);
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,

        /* ADMIN */
        approveProduct,
        rejectProduct,
        flagProduct,
        unflagProduct,

        /* REVIEWS */
        addReview,
        editReview,
        deleteReview,

        /* STOCK */
        reduceStock,
        restoreStockAfterCancel,

        /* SELLER */
        setSellerProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
