import api from "../api/axios";

/* ================= GET WISHLIST ================= */

const getWishlist = () => {
  return api.get("/buyer/wishlist");
};

/* ================= ADD TO WISHLIST ================= */

const add = (productId) => {
  return api.post(`/buyer/wishlist/${productId}`);
};

/* ================= REMOVE FROM WISHLIST ================= */

const remove = (productId) => {
  return api.delete(`/buyer/wishlist/${productId}`);
};

export default {
  getWishlist,
  add,
  remove,
};
