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

  /* ================= SIGNUP ================= */
  const signup = (form) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find((u) => u.email === form.email);
    if (exists) return false;

    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: "buyer",
      phone: "",
      address: "",
      sellerInfo: null,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  };

  /* ================= UPDATE USER ROLE (BECOME SELLER) ================= */
  const updateUserRole = (sellerData) => {
    if (!user) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.map((u) =>
      u.email === user.email
        ? {
            ...u,
            role: "seller",
            phone: sellerData.phone,
            address: sellerData.address,
            sellerInfo: sellerData,
          }
        : u
    );

    localStorage.setItem("users", JSON.stringify(users));

    const updatedUser = {
      ...user,
      role: "seller",
      phone: sellerData.phone,
      address: sellerData.address,
      sellerInfo: sellerData,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  /* ================= UPDATE USER PROFILE ================= */
  const updateUser = (data) => {
    if (!user) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.map((u) =>
      u.email === user.email
        ? {
            ...u,
            name: data.username,
            phone: data.phone,
            address: data.address,
          }
        : u
    );

    localStorage.setItem("users", JSON.stringify(users));

    const updatedUser = {
      ...user,
      username: data.username,
      phone: data.phone,
      address: data.address,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
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
        updateUser,
        verifyEmail,
        resetPassword,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
