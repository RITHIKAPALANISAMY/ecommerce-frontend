import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ProductContext = createContext();
const API_BASE = "http://localhost:8082/api/products";

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= NORMALIZE ID ================= */
  const normalizeProducts = (data) => {
    if (!Array.isArray(data)) return [];

    return data.map((p) => ({
      ...p,
      id: p.id || p._id,
    }));
  };

  /* ================= FETCH APPROVED PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE}/approved`);
      const normalized = normalizeProducts(response.data);

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

  /* ================= GET SINGLE PRODUCT ================= */
  const getProductById = async (id) => {
    if (!id) return null;

    try {
      const response = await axios.get(`${API_BASE}/view/${id}`);
      return response.data;
    } catch (error) {
      console.error("Fetch product by id error:", error);
      return null;
    }
  };

  /* ================= REFRESH SINGLE PRODUCT IN STATE ================= */
  const refreshSingleProduct = async (id) => {
    if (!id) return;

    try {
      const response = await axios.get(`${API_BASE}/view/${id}`);
      const updatedProduct = response.data;

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...updatedProduct, id } : p
        )
      );
    } catch (error) {
      console.error("Refresh product failed:", error);
    }
  };

  /* ================= CREATE PRODUCT ================= */
  const createProduct = async (productData) => {
    const response = await axios.post(API_BASE, productData);
    return response.data;
  };

  /* ================= UPDATE PRODUCT ================= */
  const updateProduct = async (id, updatedData) => {
    if (!id) throw new Error("Product ID is missing");

    const response = await axios.put(`${API_BASE}/${id}`, updatedData);
    return response.data;
  };

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = async (id) => {
    await axios.delete(`${API_BASE}/${id}`);
    fetchProducts();
  };

  /* ================= GET PRODUCTS BY SELLER ================= */
  const getProductsBySeller = async (email) => {
    if (!email) return [];

    const response = await axios.get(
      `${API_BASE}/seller/${email.trim().toLowerCase()}`
    );

    return normalizeProducts(response.data);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        getProductById,
        refreshSingleProduct,   // 🔥 NEW
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