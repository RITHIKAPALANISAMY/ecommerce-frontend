import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  /* LOGIN */
  const login = (email, password) => {
    if (!email || !password) return false;

    const loggedUser = {
      email,
      role: "buyer", // ✅ DEFAULT ROLE
    };

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    return true;
  };

  /* LOGOUT */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  /* BECOME SELLER */
  const updateUserRole = (role, sellerInfo = {}) => {
  setUser((prev) => {
    if (!prev) return prev;

    const updatedUser = {
      ...prev,
      role,
      sellerInfo, // ✅ STORE SELLER DETAILS
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  });
};


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUserRole, // ✅ EXPOSED
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
