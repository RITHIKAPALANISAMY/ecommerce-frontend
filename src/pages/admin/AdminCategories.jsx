import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./AdminCategories.css";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  /* ================= FETCH ================= */

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= ADD ================= */

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await api.post("/api/categories", {
        name: newCategory.trim(),
      });

      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Add failed", err);
      alert("Failed to add category");
    }
  };

  /* ================= DELETE ================= */

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  /* ================= EDIT ================= */

  const startEdit = (category) => {
    setEditId(category.id);
    setEditName(category.name);
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;

    try {
      // ✅ FIXED HERE → PUT instead of POST
      await api.put(`/api/categories/${editId}`, {
        name: editName.trim(),
      });

      setEditId(null);
      setEditName("");
      fetchCategories();
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="categories-page">
      <h2 className="page-title">Manage Categories</h2>

      {/* ADD CATEGORY */}
      <div className="add-category">
        <input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={addCategory}>Add</button>
      </div>

      {/* LOADING */}
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {/* CATEGORY TABLE */}
      {!loading && (
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
                        <button
                          className="save-btn"
                          onClick={saveEdit}
                        >
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
      )}
    </div>
  );
}
