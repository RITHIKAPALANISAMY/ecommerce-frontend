import { useEffect, useState } from "react";
import "./Deals.css";

const STORAGE_KEY = "admin_deals";

const defaultDeals = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 30% off on Fashion products",
    discount: "30%",
    expiry: "2026-03-31",
  },
  {
    id: 2,
    title: "Electronics Bonanza",
    description: "Flat ₹500 off on Electronics",
    discount: "₹500",
    expiry: "2026-02-15",
  },
  {
    id: 3,
    title: "New Year Deal",
    description: "20% off for all new users",
    discount: "20%",
    expiry: "2026-01-01",
  },
];

const Deals = () => {
  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultDeals;
  });

  const [editingDeal, setEditingDeal] = useState(null);
  const [newDeal, setNewDeal] = useState({
    title: "",
    description: "",
    discount: "",
    expiry: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  }, [deals]);

  const today = new Date().toISOString().split("T")[0];

  /* ===== ADD ===== */
  const handleAdd = () => {
    if (!newDeal.title || !newDeal.discount || !newDeal.expiry) {
      alert("Fill all fields");
      return;
    }

    setDeals([...deals, { ...newDeal, id: Date.now() }]);
    setNewDeal({ title: "", description: "", discount: "", expiry: "" });
  };

  /* ===== DELETE ===== */
  const handleDelete = (id) => {
    if (!window.confirm("Delete this deal?")) return;
    setDeals(deals.filter((d) => d.id !== id));
  };

  /* ===== SAVE EDIT ===== */
  const handleSave = () => {
    setDeals(
      deals.map((d) =>
        d.id === editingDeal.id ? editingDeal : d
      )
    );
    setEditingDeal(null);
  };

  return (
    <div className="deals-container">
      <h2>Deals & Offers</h2>

      {/* ADD DEAL */}
      <div className="add-deal">
        <input
          placeholder="Title"
          value={newDeal.title}
          onChange={(e) =>
            setNewDeal({ ...newDeal, title: e.target.value })
          }
        />
        <input
          placeholder="Description"
          value={newDeal.description}
          onChange={(e) =>
            setNewDeal({
              ...newDeal,
              description: e.target.value,
            })
          }
        />
        <input
          placeholder="Discount (30% / ₹500)"
          value={newDeal.discount}
          onChange={(e) =>
            setNewDeal({
              ...newDeal,
              discount: e.target.value,
            })
          }
        />
        <input
          type="date"
          value={newDeal.expiry}
          onChange={(e) =>
            setNewDeal({ ...newDeal, expiry: e.target.value })
          }
        />
        <button onClick={handleAdd}>Add Deal</button>
      </div>

      {/* DEAL CARDS */}
      <div className="deals-grid">
        {deals.map((deal) => {
          const expired = deal.expiry < today;

          return (
            <div className="deal-card" key={deal.id}>
              <h3>{deal.title}</h3>
              <p>{deal.description}</p>

              <div className="deal-footer">
                <span className="discount-badge">
                  {deal.discount}
                </span>

                <span
                  className={`status ${
                    expired ? "expired" : "active"
                  }`}
                >
                  {expired ? "Expired" : "Active"}
                </span>
              </div>

              <div className="actions">
                <button
                  className="btn edit"
                  onClick={() => setEditingDeal(deal)}
                >
                  Edit
                </button>
                <button
                  className="btn delete"
                  onClick={() => handleDelete(deal.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {editingDeal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Deal</h3>

            <input
              value={editingDeal.title}
              onChange={(e) =>
                setEditingDeal({
                  ...editingDeal,
                  title: e.target.value,
                })
              }
            />
            <input
              value={editingDeal.description}
              onChange={(e) =>
                setEditingDeal({
                  ...editingDeal,
                  description: e.target.value,
                })
              }
            />
            <input
              value={editingDeal.discount}
              onChange={(e) =>
                setEditingDeal({
                  ...editingDeal,
                  discount: e.target.value,
                })
              }
            />
            <input
              type="date"
              value={editingDeal.expiry}
              onChange={(e) =>
                setEditingDeal({
                  ...editingDeal,
                  expiry: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button className="btn save" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn cancel"
                onClick={() => setEditingDeal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;
