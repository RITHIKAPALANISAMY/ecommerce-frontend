import axios from "./axiosInstance";

const getWishlist = () => axios.get("/wishlist");

const add = (productId) =>
  axios.post("/wishlist/add", { productId });

const remove = (productId) =>
  axios.delete(`/wishlist/remove/${productId}`);

export default {
  getWishlist,
  add,
  remove
};
