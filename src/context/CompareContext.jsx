import { createContext, useContext, useState } from "react";
import Swal from "sweetalert2";

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);
  const [compareResult, setCompareResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= ADD TO COMPARE ================= */

  const addToCompare = (product) => {
    if (!product) return;

    const productCategoryId =
      product.categoryId || product.category?.id;

    /* ================= CATEGORY CHECK ================= */

    if (!productCategoryId) {
      Swal.fire({
        icon: "error",
        title: "Category Missing",
        text: "Product category not found.",
        confirmButtonColor: "#d33",
      });

      return;
    }

    /* ================= DUPLICATE CHECK ================= */

    if (compareItems.some((p) => p.id === product.id)) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Product already added",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      return;
    }

    /* ================= MAX 3 PRODUCTS ================= */

    if (compareItems.length >= 3) {
      Swal.fire({
        icon: "warning",
        title: "Limit Reached",
        text: "You can compare up to 3 products only.",
        confirmButtonColor: "#3085d6",
      });

      return;
    }

    /* ================= SAME CATEGORY CHECK ================= */

    if (compareItems.length > 0) {
      const firstCategoryId =
        compareItems[0].categoryId ||
        compareItems[0].category?.id;

      if (String(productCategoryId) !== String(firstCategoryId)) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title:
            "You can only compare products from the same category",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });

        return;
      }
    }

    /* ================= ADD PRODUCT ================= */

    setCompareItems((prev) => [...prev, product]);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Product added to compare",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  };

  /* ================= REMOVE ================= */

  const removeFromCompare = (id) => {
    setCompareItems((prev) =>
      prev.filter((p) => p.id !== id)
    );

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Product removed",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  /* ================= CLEAR ================= */

  const clearCompare = () => {
    setCompareItems([]);
    setCompareResult(null);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Compare list cleared",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  /* ================= FETCH COMPARISON ================= */

  const fetchComparison = async () => {
    if (compareItems.length < 2) {
      Swal.fire({
        icon: "warning",
        title: "Minimum 2 Products Required",
        text: "Please add at least 2 products to compare.",
      });

      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8082/api/products/compare",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productIds: compareItems.map((p) => p.id),
          }),
        }
      );

      const data = await res.json();

      setCompareResult(data);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Comparison loaded",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Compare failed:", err);

      Swal.fire({
        icon: "error",
        title: "Compare Failed",
        text: "Something went wrong while comparing products.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        compareResult,
        loading,
        addToCompare,
        removeFromCompare,
        clearCompare,
        fetchComparison,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);