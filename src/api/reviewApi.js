import axios from "axios";

export const reviewApi = axios.create({
  baseURL: "http://localhost:8082/api/reviews",
  headers: {
    "Content-Type": "application/json",
  },
});