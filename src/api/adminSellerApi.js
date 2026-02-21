import api from "./axios";

export const getPendingSellerRequests = () =>
  api.get("/admin/seller/pending");

export const approveSellerRequest = (id) =>
  api.put(`/admin/seller/approve/${id}`);
