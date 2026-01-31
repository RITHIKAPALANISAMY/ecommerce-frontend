import { useState } from "react";

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

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    /* ===== Overlay ===== */
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      {/* ===== Modal Card ===== */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h3 className="mb-5 text-xl font-semibold text-gray-800">
          Edit Profile
        </h3>

        {/* ===== Name ===== */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        {/* ===== Email ===== */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            value={form.email}
            disabled
            className="w-full cursor-not-allowed rounded-lg border bg-gray-100 px-3 py-2 text-sm text-gray-500"
          />
        </div>

        {/* ===== Phone ===== */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Phone
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Add phone number"
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        {/* ===== Address ===== */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Address
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Add address"
            rows={3}
            className="w-full resize-none rounded-lg border px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        {/* ===== Actions ===== */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
