import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  /* ================= LOGIN ================= */
  const login = (email, password) => {
    if (email === "admin@shopverse.com" && password === "admin123") {
      const adminUser = {
        username: "Admin",
        email,
        role: "admin",
        phone: "",
        address: "",
        sellerInfo: null,
        mode: "admin",
      };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return adminUser;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return null;

    const loggedUser = {
      username: found.name,
      email: found.email,
      role: found.role || "buyer",
      phone: found.phone || "",
      address: found.address || "",
      sellerInfo: found.sellerInfo || null,
      mode: "buyer",
    };

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    return loggedUser;
  };

  /* ================= VERIFY EMAIL ================= */
  const verifyEmail = (email) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.some((u) => u.email === email);
  };

  /* ================= RESET PASSWORD ================= */
  const resetPassword = (email, newPassword) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.map((u) =>
      u.email === email ? { ...u, password: newPassword } : u
    );

    localStorage.setItem("users", JSON.stringify(users));
  };

  /* ================= DELETE ACCOUNT ================= */
  const deleteAccount = () => {
    if (!user) return;

    const email = user.email;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.filter((u) => u.email !== email);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders = orders.filter((o) => o.buyerEmail !== email);
    localStorage.setItem("orders", JSON.stringify(orders));

    setUser(null);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        verifyEmail,     // ✅ added
        resetPassword,   // ✅ added
        deleteAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
