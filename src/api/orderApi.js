import api from "./axios";

export const placeOrder = (data) =>
  api.post("/api/orders", data);

export const getOrderById = (id) =>
  api.get(`/api/orders/${id}`);

export const getBuyerOrders = (email) =>
  api.get(`/api/orders/buyer/${email}`);

export const getSellerOrders = (email) =>
  api.get(`/api/orders/seller/${email}`);

export const updateOrderStatus = (id, status) =>
  api.put(`/api/orders/${id}/status?status=${status}`);

export const cancelOrder = (id) =>
  api.delete(`/api/orders/${id}`);