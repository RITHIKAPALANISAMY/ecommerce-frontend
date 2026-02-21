import axios from "axios";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

/* Automatically choose service based on URL */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  /* 🔥 Smart Microservice Routing */

  if (
    config.url.startsWith("/api/products") ||
    config.url.startsWith("/api/categories") ||
    config.url.startsWith("/api/inventory")
  ) {
    config.baseURL = "http://localhost:8082"; // Product Service
  }

  else if (
    config.url.startsWith("/api/orders") ||
    config.url.startsWith("/api/coupons") ||
    config.url.startsWith("/api/analytics")
  ) {
    config.baseURL = "http://localhost:8085"; // ✅ Order Service
  }

  else {
    config.baseURL = "http://localhost:8081"; // Auth Service
  }

  return config;
});

export default api;