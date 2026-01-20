import { createContext, useContext } from "react";
import products from "../data/products";
import { useSellerProducts } from "./SellerProductContext";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const { sellerProducts } = useSellerProducts();

  // 🔥 ONE MERGE POINT
  const allProducts = [...products, ...sellerProducts];

  return (
    <ProductContext.Provider value={{ products: allProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
