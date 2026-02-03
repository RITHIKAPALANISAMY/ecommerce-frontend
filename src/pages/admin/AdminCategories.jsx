import { useEffect, useState } from "react";
import "./AdminCategories.css";

const STORAGE_KEY = "admin_categories";

const defaultCategories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Fashion" },
  { id: 3, name: "Home & Kitchen" },
];

const AdminCategories = () => {
 
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

 
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);


  const addCategory = () => {
    if (!newCategory.trim()) return;

    const exists = categories.some(
      (c) => c.name.toLowerCase() === newCategory.toLowerCase()
    );

    if (exists) {
      alert("Category already exists");
      return;
    }

    setCategories([
      ...categories,
      { id: Date.now(), name: newCategory.trim() },
    ]);

    setNewCategory("");
  };

  
  const deleteCategory = (id) => {
    if (!window.confirm("Delete this category?")) return;
    setCategories(categories.filter((c) => c.id !== id));
  };

  
  const startEdit = (category) => {
    setEditId(category.id);
    setEditName(category.name);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;

    setCategories((prev) =>
      prev.map((c) =>
        c.id === editId ? { ...c, name: editName.trim() } : c
      )
    );

    setEditId(null);
    setEditName("");
  };

  return (
    <div className="categories-page">
      <h2 className="page-title">Manage Categories</h2>

    
      <div className="add-category">
        <input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={addCategory}>Add</button>
      </div>

      
      <table className="categories-table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No categories found
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id}>
                <td>
                  {editId === category.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    category.name
                  )}
                </td>

                <td style={{ textAlign: "center" }}>
                  {editId === category.id ? (
                    <>
                      <button className="save-btn" onClick={saveEdit}>
                        Save
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteCategory(category.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCategories;