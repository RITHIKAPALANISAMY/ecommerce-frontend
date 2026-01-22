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
        mode: "admin",
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

    // 🔑 IMPORTANT: DEFAULT MODE IS BUYER
    const loggedUser = {
      username: found.name,
      email: found.email,
      role: found.role || "buyer", // capability
      mode: "buyer",               // current usage
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

  /* ================= BECOME SELLER ================= */
  const updateUserRole = (sellerData) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      role: "seller",
      sellerInfo: sellerData,
      mode: "buyer", // 🔥 still buyer mode
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) =>
      u.email === user.email ? { ...u, role: "seller" } : u
    );
    localStorage.setItem("users", JSON.stringify(users));
  };

  /* ================= ENTER SELLER MODE ================= */
  const enterSellerMode = () => {
    if (!user || user.role !== "seller") return;

    const updatedUser = {
      ...user,
      mode: "seller",
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  /* ================= EXIT SELLER MODE ================= */
  const exitSellerMode = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      mode: "buyer",
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
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
        updateUserRole,
        enterSellerMode,
        exitSellerMode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
