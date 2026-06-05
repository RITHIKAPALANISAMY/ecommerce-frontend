import api from "./axios";

export const getUserCart = () => api.get("/cart");

export const addToCartAPI = (data) => api.post("/cart", data);

export const updateCartQtyAPI = (id, qty) =>
  api.put(`/cart/${id}/${qty}`);

export const removeCartItemAPI = (id) =>
  api.delete(`/cart/${id}`);

export const clearCartAPI = () =>
  api.delete("/cart/clear");