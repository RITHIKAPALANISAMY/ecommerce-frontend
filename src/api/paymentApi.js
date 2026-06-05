import axios from "axios";

const paymentApi = axios.create({
  baseURL: "http://localhost:8084",
  headers: {
    "Content-Type": "application/json",
  },
});
export const getAllPayments = () =>
  paymentApi.get("/payment/admin/all");

export const refundPayment = (id) =>
  paymentApi.post(`/payment/admin/refund/${id}`);
paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default paymentApi;