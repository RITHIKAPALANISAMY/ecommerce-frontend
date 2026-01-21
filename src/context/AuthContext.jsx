import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  /* ================= LOGIN ================= */
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) return false;

    const loggedUser = {
      username: found.name,
      email: found.email,
      role: found.role || "buyer",
    };

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    return true;
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
  const updateUserRole = (role, sellerData) => {
    if (!user) return;

    // update logged-in user
    const updatedUser = {
      ...user,
      role,
      sellerInfo: sellerData,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // update users list
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
        updateUserRole, // 🔥 REQUIRED
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
