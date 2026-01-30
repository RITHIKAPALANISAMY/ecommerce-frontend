import { createContext, useContext, useEffect, useState } from "react";
import baseProducts from "../data/products";
const ProductContext = createContext();
export function ProductProvider({ children }) {
  
  const [sellerProducts, setSellerProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(sellerProducts));
  }, [sellerProducts]);

  const [reviewsMap, setReviewsMap] = useState(() => {
    const saved = localStorage.getItem("productReviews");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("productReviews", JSON.stringify(reviewsMap));
  }, [reviewsMap]);

  const [approvalMap, setApprovalMap] = useState(() => {
    const saved = localStorage.getItem("productApproval");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("productApproval", JSON.stringify(approvalMap));
  }, [approvalMap]);

  const [flagMap, setFlagMap] = useState(() => {
    const saved = localStorage.getItem("productFlags");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("productFlags", JSON.stringify(flagMap));
  }, [flagMap]);

  const [stockMap, setStockMap] = useState(() => {
    const saved = localStorage.getItem("productStock");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("productStock", JSON.stringify(stockMap));
  }, [stockMap]);

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
    flagged: flagMap[p.id] || false,
    stock: stockMap[p.id] ?? p.stock ?? 10,
  }));

  /* ================= ADMIN ACTIONS ================= */
  const approveProduct = (id) => {
    setApprovalMap((prev) => ({ ...prev, [id]: "Approved" }));
  };

  const rejectProduct = (id) => {
    setApprovalMap((prev) => ({ ...prev, [id]: "Rejected" }));
  };

  const flagProduct = (id) => {
    setFlagMap((prev) => ({ ...prev, [id]: true }));
  };

  const unflagProduct = (id) => {
    setFlagMap((prev) => ({ ...prev, [id]: false }));
  };

  /* ================= REVIEW ACTIONS ================= */
  const addReview = (productId, review) => {
    setReviewsMap((prev) => {
      const productReviews = prev[productId] || [];

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

  const editReview = (productId, reviewId, updated) => {
    setReviewsMap((prev) => ({
      ...prev,
      [productId]: prev[productId].map((r) =>
        r.id === reviewId ? { ...r, ...updated, edited: true } : r
      ),
    }));
  };

  const deleteReview = (productId, reviewId) => {
    setReviewsMap((prev) => ({
      ...prev,
      [productId]: prev[productId].filter((r) => r.id !== reviewId),
    }));
  };

  /* ================= STOCK HELPERS (USED BY SELLER & ORDERS) ================= */
  const reduceStock = (items) => {
    setStockMap((prev) => {
      const updated = { ...prev };
      items.forEach((item) => {
        updated[item.productId] =
          (updated[item.productId] ?? item.stock ?? 10) - item.quantity;
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

  /* ================= REAL-TIME SYNC (MULTI-TAB) ================= */
  useEffect(() => {
    const syncProducts = () => {
      const saved = localStorage.getItem("products");
      setSellerProducts(saved ? JSON.parse(saved) : []);
    };

    window.addEventListener("storage", syncProducts);
    return () => window.removeEventListener("storage", syncProducts);
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
