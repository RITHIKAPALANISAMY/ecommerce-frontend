import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ProductContext = createContext();

const API_BASE = "http://localhost:8082/api/products";

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= NORMALIZE PRODUCT ================= */
  const normalizeProduct = (product) => {
    if (!product) return null;

    return {
      ...product,
      id: product.id || product._id, // MongoDB compatibility
    };
  };

  /* ================= FETCH ALL PRODUCTS ================= */
  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await axios.get(API_BASE);

      if (!Array.isArray(response.data)) {
        setProducts([]);
        return;
      }

      const normalized = response.data
        .map(normalizeProduct)
        .filter(Boolean);

      setProducts(normalized);

    } catch (error) {
      console.error(
        "Fetch products error:",
        error.response?.data || error.message
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= CREATE PRODUCT ================= */
  const createProduct = async (productData) => {
    try {
      const response = await axios.post(API_BASE, productData);

      const created = normalizeProduct(response.data);

      // Prevent duplicates
      setProducts((prev) => {
        if (prev.some((p) => p.id === created.id)) return prev;
        return [...prev, created];
      });

      return created;

    } catch (error) {
      console.error(
        "Create product error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /* ================= UPDATE PRODUCT ================= */
  const updateProduct = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${API_BASE}/${id}`,
        updatedData
      );

      const updated = normalizeProduct(response.data);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? updated : p
        )
      );

      return updated;

    } catch (error) {
      console.error(
        "Update product error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);

      setProducts((prev) =>
        prev.filter((p) => p.id !== id)
      );

    } catch (error) {
      console.error(
        "Delete product error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  /* ================= GET PRODUCTS BY SELLER ================= */
  const getProductsBySeller = async (email) => {
    if (!email) return [];

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await axios.get(
        `${API_BASE}/seller/${normalizedEmail}`
      );

      if (!Array.isArray(response.data)) return [];

      return response.data
        .map(normalizeProduct)
        .filter(Boolean);

    } catch (error) {
      console.error(
        "Fetch seller products error:",
        error.response?.data || error.message
      );
      return [];
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getProductsBySeller,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
