import { createContext, useContext, useState, useEffect } from "react";

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    const saved = localStorage.getItem("compareItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Persist compare items
  useEffect(() => {
    localStorage.setItem("compareItems", JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product) => {
    // Max limit
    if (compareItems.length >= 3) {
      alert("You can compare only 3 products");
      return;
    }

    // Prevent duplicates
    const exists = compareItems.some((item) => item.id === product.id);
    if (exists) return;

    // Category restriction
    if (
      compareItems.length > 0 &&
      compareItems[0].category !== product.category
    ) {
      alert("You can only compare products from the same category");
      return;
    }

    setCompareItems((prev) => [...prev, product]);
  };

  const removeFromCompare = (id) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
