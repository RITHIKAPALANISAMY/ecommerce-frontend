import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 🔹 Load from localStorage
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  });

  // 🔹 Persist to localStorage
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // 🔹 Add new user (Buyer / Seller)
  const addUser = (user) => {
    setUsers((prev) => [...prev, { ...user, status: "active" }]);
  };

  // 🔹 Block user
  const blockUser = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: "blocked" } : u
      )
    );
  };

  // 🔹 Unblock user
  const unblockUser = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: "active" } : u
      )
    );
  };

  return (
    <UserContext.Provider
      value={{ users, addUser, blockUser, unblockUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);