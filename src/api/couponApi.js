import api from "./axios";

// CREATE
export const createCoupon = (data) =>
  api.post("/api/coupons", data, {
    baseURL: "http://localhost:8085",
  });

// GET ALL
export const getAllCoupons = () =>
  api.get("/api/coupons", {
    baseURL: "http://localhost:8085",
  });

// UPDATE
export const updateCoupon = (id, data) =>
  api.put(`/api/coupons/${id}`, data, {
    baseURL: "http://localhost:8085",
  });

// DELETE
export const deleteCoupon = (id) =>
  api.delete(`/api/coupons/${id}`, {
    baseURL: "http://localhost:8085",
  });