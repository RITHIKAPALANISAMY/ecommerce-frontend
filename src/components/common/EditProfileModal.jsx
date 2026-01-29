import { useState } from "react";
import "../../styles/profile.css";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ UPDATED (added close + safety)
  const handleSubmit = (e) => {
    e.preventDefault();          // ✅ prevent any default behavior
    onSave(form);               // ✅ save updated data
    onClose();                  // ✅ close modal after saving
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()} // ✅ already correct
      >
        <h3>Edit Profile</h3>

        <div className="modal-field">
          <label>Name</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div className="modal-field">
          <label>Email</label>
          <input value={form.email} disabled />
        </div>

        <div className="modal-field">
          <label>Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Add phone number"
          />
        </div>

        <div className="modal-field">
          <label>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Add address"
          />
        </div>

        <div className="modal-actions">
          <button
            className="btn secondary"
            type="button"          // ✅ IMPORTANT
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn primary"
            type="button"          // ✅ IMPORTANT
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
