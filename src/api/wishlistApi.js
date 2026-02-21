import api from "./axios";

// GET /buyer/wishlist
const getWishlist = () =>
  api.get("/buyer/wishlist");

// POST /buyer/wishlist/{productId}
const add = (productId) =>
  api.post(`/buyer/wishlist/${productId}`);

// DELETE /buyer/wishlist/{productId}
const remove = (productId) =>
  api.delete(`/buyer/wishlist/${productId}`);

export default {
  getWishlist,
  add,
  remove,
};
