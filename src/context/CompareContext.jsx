import { createContext, useContext, useState, useEffect } from "react";

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    const saved = localStorage.getItem("compareItems");
    return saved ? JSON.parse(saved) : [];
  });

  // 💾 Persist compare items
  useEffect(() => {
    localStorage.setItem("compareItems", JSON.stringify(compareItems));
  }, [compareItems]);

  // 🔁 Recalculate ratings when reviews change (REAL-TIME)
  useEffect(() => {
    const syncRatingsFromReviews = () => {
      const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];

      setCompareItems((prev) =>
        prev.map((product) => {
          const productReviews = allReviews.filter(
            (r) => r.productId === product.id
          );

          if (productReviews.length === 0) {
            return { ...product, rating: null };
          }

          const total = productReviews.reduce(
            (sum, r) => sum + r.rating,
            0
          );

          return {
            ...product,
            rating: {
              rate: +(total / productReviews.length).toFixed(1),
              count: productReviews.length,
            },
          };
        })
      );
    };

    // Initial sync
    syncRatingsFromReviews();

    // Listen to localStorage updates
    window.addEventListener("storage", syncRatingsFromReviews);
    return () =>
      window.removeEventListener("storage", syncRatingsFromReviews);
  }, []);

  // ➕ ADD TO COMPARE
  const addToCompare = (product) => {
    if (compareItems.length >= 3) {
      alert("You can compare only 3 products");
      return;
    }

    if (compareItems.some((item) => item.id === product.id)) return;

    if (
      compareItems.length > 0 &&
      compareItems[0].category !== product.category
    ) {
      alert("You can only compare products from the same category");
      return;
    }

    // ✅ Derive rating from SAME reviews source used in ProductDetails
    const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const productReviews = allReviews.filter(
      (r) => r.productId === product.id
    );

    let rating = null;

    if (productReviews.length > 0) {
      const total = productReviews.reduce(
        (sum, r) => sum + r.rating,
        0
      );
      rating = {
        rate: +(total / productReviews.length).toFixed(1),
        count: productReviews.length,
      };
    }

    const normalizedProduct = {
      ...product,
      rating,
      images: product.images?.length
        ? product.images
        : product.image
        ? [product.image]
        : [],
    };

    setCompareItems((prev) => [...prev, normalizedProduct]);
  };

  // ❌ REMOVE
  const removeFromCompare = (id) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 🧹 CLEAR
  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
