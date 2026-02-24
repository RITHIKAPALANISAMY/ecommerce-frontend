// src/api/userService.js

import axios from "axios";

/* =====================================
   AXIOS INSTANCE
===================================== */
const API = axios.create({
  baseURL: "http://localhost:8081",
});

/* =====================================
   ATTACH ACCESS TOKEN AUTOMATICALLY
===================================== */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================
   HANDLE API ERRORS
===================================== */
const handleError = (error, defaultMessage) => {
  if (error.response?.data) {
    if (typeof error.response.data === "string") {
      throw error.response.data;
    }
    if (error.response.data.message) {
      throw error.response.data.message;
    }
  }
  throw defaultMessage;
};
/* =====================================
   GET USER PROFILE
===================================== */
export const getUserProfile = async () => {
  try {
    const response = await API.get("/user/profile");
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch profile");
  }
};

/* =====================================
   UPDATE PROFILE
===================================== */
export const updateUserProfile = async (data) => {
  try {
    const response = await API.put("/user/profile", data);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update profile");
  }
};

/* =====================================
   UPLOAD PROFILE IMAGE
===================================== */
export const uploadProfileImage = async (formData) => {
  const response = await API.post(
    "/user/profile/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
/* =====================================
   DELETE ACCOUNT
===================================== */
export const deleteUserAccount = async () => {
  try {
    const response = await API.delete("/user/profile");
    return response.data;
  } catch (error) {
    handleError(error, "Failed to delete account");
  }
};

/* =====================================
   CHANGE PASSWORD
===================================== */
export const changeUserPassword = async (passwordData) => {
  try {
    const response = await API.put(
      "/user/change-password",
      passwordData
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to change password");
  }
};

export default API;