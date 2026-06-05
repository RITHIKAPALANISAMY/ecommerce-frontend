import api from "./axios";

/* ================= GET ALL SELLER REQUESTS ================= */
export const getAllSellerRequests = () =>
  api.get("/admin/seller/all");

/* ================= GET PENDING ONLY ================= */
export const getPendingSellerRequests = () =>
  api.get("/admin/seller/pending");

/* ================= APPROVE ================= */
export const approveSellerRequest = (id) =>
  api.put(`/admin/seller/approve/${id}`);

/* ================= REJECT ================= */
export const rejectSellerRequest = (id) =>
  api.put(`/admin/seller/reject/${id}`);

/* ================= DELETE ================= */
export const deleteSellerRequest = (id) =>
  api.delete(`/admin/seller/delete/${id}`);