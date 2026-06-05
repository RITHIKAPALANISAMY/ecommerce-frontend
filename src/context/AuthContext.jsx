import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/user/profile");
      const profile = response.data;

      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        gender: profile.gender,
        profileImage: profile.profileImage,
        verified: profile.verified,
        storeName: profile.storeName,
        storePhone: profile.storePhone,
        gstNumber: profile.gstNumber,
        storeAddress: profile.storeAddress,
        roles: profile.roles.map((r) =>
          r.replace("ROLE_", "").toUpperCase()
        ),
      });
    } catch (error) {
      console.error("Session expired");
      localStorage.clear();
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    const init = async () => {
      await fetchUserProfile();
      setLoading(false);
    };

    init();
  }, []);

  const login = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      await fetchUserProfile();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (data) => {
    try {
      const response = await api.post("/auth/register", data);
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      await fetchUserProfile();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Register failed",
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
  user,
  loading,
  login,
  register,
  logout,
  fetchUserProfile
}}
    >
      {children} {/* ✅ ALWAYS RENDER */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);