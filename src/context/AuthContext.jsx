import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ON APP START ================= */

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/user/profile");

        const profile = response.data;

        const formattedUser = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          verified: profile.verified,
          roles: profile.roles.map((r) =>
            r.replace("ROLE_", "").toLowerCase()
          ),
        };

        setUser(formattedUser);
      } catch (error) {
        console.error("Auth init failed:", error);
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /* ================= LOGIN ================= */

  const login = async (data) => {
    try {
      const response = await api.post("/auth/login", data);

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Immediately fetch profile
      const profileRes = await api.get("/user/profile");

      const profile = profileRes.data;

      const formattedUser = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        verified: profile.verified,
        roles: profile.roles.map((r) =>
          r.replace("ROLE_", "").toLowerCase()
        ),
      };

      setUser(formattedUser);

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed";
      return { success: false, message };
    }
  };

  /* ================= REGISTER ================= */

  const register = async (data) => {
    try {
      const response = await api.post("/auth/register", data);

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const profileRes = await api.get("/user/profile");

      const profile = profileRes.data;

      const formattedUser = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        verified: profile.verified,
        roles: profile.roles.map((r) =>
          r.replace("ROLE_", "").toLowerCase()
        ),
      };

      setUser(formattedUser);

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Register failed";
      return { success: false, message };
    }
  };

  /* ================= LOGOUT ================= */

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
