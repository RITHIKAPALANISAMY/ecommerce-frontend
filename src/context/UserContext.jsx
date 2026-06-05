import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= SORT USERS (LATEST FIRST) ================= */

  const sortUsers = (data) => {
    if (!Array.isArray(data)) return [];

    return [...data].sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    );
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/user/admin/all");

      const data = response.data.content || response.data;

      const formattedUsers = data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role:
          u.roles?.[0]?.replace("ROLE_", "").toLowerCase() ||
          "buyer",
        status: u.accountLocked ? "blocked" : "active",
        createdAt: u.createdAt || null,
      }));

      /* 🔥 SORT LATEST USERS FIRST */
      setUsers(sortUsers(formattedUsers));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= BLOCK ================= */

  const blockUser = async (userId) => {
    await api.put(`/user/admin/ban/${userId}`);
    fetchUsers();
  };

  /* ================= UNBLOCK ================= */

  const unblockUser = async (userId) => {
    await api.put(`/user/admin/unban/${userId}`);
    fetchUsers();
  };

  /* ================= DELETE ================= */

  const deleteUser = async (userId) => {
    await api.delete(`/user/admin/delete/${userId}`);
    fetchUsers();
  };

  /* ================= UPDATE ================= */

  const updateUser = async (userId, data) => {
    await api.put(`/user/admin/update/${userId}`, data);
    fetchUsers();
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        blockUser,
        unblockUser,
        deleteUser,
        updateUser,
        refreshUsers: fetchUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);