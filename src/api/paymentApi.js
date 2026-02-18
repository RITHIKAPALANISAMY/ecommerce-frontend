import axios from "axios";

const paymentApi = axios.create({
  baseURL: "http://localhost:8084", // ✅ Payment Service
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if needed
paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default paymentApi;
