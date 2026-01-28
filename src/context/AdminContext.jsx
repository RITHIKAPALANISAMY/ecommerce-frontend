import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const [products, setProducts] = useState(
    JSON.parse(localStorage.getItem("products")) || []
  );

  const [categories, setCategories] = useState(
    JSON.parse(localStorage.getItem("categories")) || []
  );

  /* STORE DATA */
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [users, products, categories]);

  /* USER ACTIONS */
  const approveUser = (id) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, approved: true } : u
    ));
  };

  const banUser = (id) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, banned: true } : u
    ));
  };

  /* PRODUCT ACTIONS */
  const flagProduct = (id) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, flagged: true } : p
    ));
  };

  /* CATEGORY */
  const addCategory = (name) => {
    setCategories([...categories, { id: Date.now(), name }]);
  };

  return (
    <AdminContext.Provider value={{
      users,
      products,
      categories,
      approveUser,
      banUser,
      flagProduct,
      addCategory
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);