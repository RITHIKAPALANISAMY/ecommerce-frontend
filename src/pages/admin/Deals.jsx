import { useState } from "react";
import "./Deals.css";

const initialDeals = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 30% off on Fashion products",
    discount: "30%",
    status: "Active",
  },
  {
    id: 2,
    title: "Electronics Bonanza",
    description: "Flat ₹500 off on Electronics",
    discount: "₹500",
    status: "Active",
  },
  {
    id: 3,
    title: "New Year Deal",
    description: "20% off for all new users",
    discount: "20%",
    status: "Expired",
  },
];

const Deals = () => {
  const [deals, setDeals] = useState(initialDeals);
  const [editingDeal, setEditingDeal] = useState(null);

  // DELETE
  const handleDelete = (id) => {
    setDeals(deals.filter((deal) => deal.id !== id));
  };

  // SAVE EDIT
  const handleSave = () => {
    setDeals(
      deals.map((deal) =>
        deal.id === editingDeal.id ? editingDeal : deal
      )
    );
    setEditingDeal(null);
  };

  return (
    <div className="deals-container">
      <h2>Deals & Offers</h2>

      <div className="deals-grid">
        {deals.map((deal) => (
          <div className="deal-card" key={deal.id}>
            <h3>{deal.title}</h3>
            <p>{deal.description}</p>

            <div className="deal-footer">
              <span className="discount">{deal.discount}</span>
              <span className={`status ${deal.status.toLowerCase()}`}>
                {deal.status}
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
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingDeal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Deal</h3>

            <input
              type="text"
              value={editingDeal.title}
              onChange={(e) =>
                setEditingDeal({ ...editingDeal, title: e.target.value })
              }
              placeholder="Title"
            />

            <input
              type="text"
              value={editingDeal.description}
              onChange={(e) =>
                setEditingDeal({
                  ...editingDeal,
                  description: e.target.value,
                })
              }
              placeholder="Description"
            />

            <input
              type="text"
              value={editingDeal.discount}
              onChange={(e) =>
                setEditingDeal({ ...editingDeal, discount: e.target.value })
              }
              placeholder="Discount"
            />

            <select
              value={editingDeal.status}
              onChange={(e) =>
                setEditingDeal({ ...editingDeal, status: e.target.value })
              }
            >
              <option>Active</option>
              <option>Expired</option>
            </select>

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
