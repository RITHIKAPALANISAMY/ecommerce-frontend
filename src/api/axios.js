import axios from "axios";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  /* Product Service */
  if (
    config.url.startsWith("/api/products") ||
    config.url.startsWith("/api/categories") ||
    config.url.startsWith("/api/inventory")
  ) {
    config.baseURL = "http://localhost:8082";
  }

  /* Wishlist Service (Auth Service - 8081) */
  else if (config.url.startsWith("/buyer/wishlist")) {
    config.baseURL = "http://localhost:8081";
  }

  /* Cart Service */
  else if (config.url.startsWith("/cart")) {
    config.baseURL = "http://localhost:8083";
  }

  /* Order Service */
  else if (
    config.url.startsWith("/api/orders") ||
    config.url.startsWith("/api/coupons") ||
    config.url.startsWith("/api/analytics")
  ) {
    config.baseURL = "http://localhost:8085";
  }

  /* Default → Auth Service */
  else {
    config.baseURL = "http://localhost:8081";
  }

  return config;
});

export default api;