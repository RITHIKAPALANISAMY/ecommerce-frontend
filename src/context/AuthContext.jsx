import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ON APP START ================= */

  useEffect(() => {
    const loadUser = async () => {
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
          role:
            profile.roles && profile.roles.length
              ? profile.roles[0].replace("ROLE_", "").toLowerCase()
              : "buyer",
        };

        setUser(formattedUser);
        localStorage.setItem("user", JSON.stringify(formattedUser));

      } catch (err) {
        console.error("Profile load failed:", err);
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* ================= REGISTER ================= */

  const register = async (data) => {
    try {
      const response = await api.post("/auth/register", data);

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      await fetchUserProfile();
      return true;

    } catch (error) {
      console.error("Register failed:", error);
      return false;
    }
  };

  /* ================= LOGIN ================= */

  const login = async (data) => {
    try {
      const response = await api.post("/auth/login", data);

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      await fetchUserProfile();
      return true;

    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  /* ================= FETCH PROFILE ================= */

  const fetchUserProfile = async () => {
    const response = await api.get("/user/profile");
    const profile = response.data;

    const formattedUser = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role:
        profile.roles && profile.roles.length
          ? profile.roles[0].replace("ROLE_", "").toLowerCase()
          : "buyer",
    };

    setUser(formattedUser);
    localStorage.setItem("user", JSON.stringify(formattedUser));
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
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
