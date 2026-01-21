import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  /* ================= LOGIN ================= */
  const login = (email, password) => {
    // 🔐 ADMIN LOGIN
    if (email === "admin@shopverse.com" && password === "admin123") {
      const adminUser = {
        username: "Admin",
        email,
        role: "admin",
      };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return adminUser;
    }

    // 👤 BUYER / SELLER LOGIN
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) return null;

    const loggedUser = {
      username: found.name,
      email: found.email,
      role: found.role || "buyer",
    };

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    return loggedUser;
  };

  /* ================= SIGNUP ================= */
  const signup = ({ name, email, password }) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((u) => u.email === email)) return false;

    users.push({
      id: Date.now(),
      name,
      email,
      password,
      role: "buyer",
    });

    localStorage.setItem("users", JSON.stringify(users));
    return true;
  };

  /* ================= FORGOT PASSWORD ================= */
  const verifyEmail = (email) => {
    if (email === "admin@shopverse.com") return true;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.some((u) => u.email === email);
  };

  /* ================= RESET PASSWORD ================= */
  const resetPassword = (email, newPassword) => {
    if (email === "admin@shopverse.com") return true;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) =>
      u.email === email ? { ...u, password: newPassword } : u
    );

    localStorage.setItem("users", JSON.stringify(users));
    return true;
  };

  /* ================= BECOME SELLER ================= */
  const updateUserRole = (role, sellerData) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      role,
      sellerInfo: sellerData,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) =>
      u.email === user.email ? { ...u, role } : u
    );

    localStorage.setItem("users", JSON.stringify(users));
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        verifyEmail,
        resetPassword,
        updateUserRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
