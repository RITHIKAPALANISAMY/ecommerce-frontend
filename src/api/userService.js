// src/api/userService.js

import api from "./axios";

/* =====================================
   HANDLE API ERRORS (CLEAN VERSION)
===================================== */
const handleError = (error, defaultMessage) => {
  console.error("API Error:", error);

  if (error.response) {
    const data = error.response.data;

    if (typeof data === "string") {
      throw data;
    }

    if (data?.message) {
      throw data.message;
    }
  }

  throw defaultMessage;
};

/* =====================================
   GET USER PROFILE
===================================== */
export const getUserProfile = async () => {
  try {
    const response = await api.get("/user/profile");
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
    const response = await api.put("/user/profile", {
      name: data.name?.trim(),
      phone: data.phone?.trim() || null,
      gender: data.gender || null,
    });

    return response.data;
  } catch (error) {
    handleError(error, "Failed to update profile");
  }
};

/* =====================================
   UPLOAD PROFILE IMAGE
===================================== */
export const uploadProfileImage = async (formData) => {
  try {
    const response = await api.post(
      "/user/profile/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    handleError(error, "Failed to upload profile image");
  }
};

/* =====================================
   DELETE ACCOUNT
===================================== */
export const deleteUserAccount = async () => {
  try {
    const response = await api.delete("/user/profile");
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
    const response = await api.put(
      "/user/change-password",
      passwordData
    );

    return response.data;
  } catch (error) {
    handleError(error, "Failed to change password");
  }
};