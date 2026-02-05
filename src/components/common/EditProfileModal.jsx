import { useState } from "react";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    username: user.username || "",
    phone: user.phone || "",
    address: user.address || "",
    profileImage: user.profileImage || "",
  });

  /* IMAGE UPLOAD */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h3 className="mb-6 text-xl font-semibold text-gray-800">
          Edit Profile
        </h3>

        {/* PROFILE IMAGE */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative">
            <img
              src={
                form.profileImage ||
                "https://ui-avatars.com/api/?name=User&background=fee2e2&color=dc2626"
              }
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-4 border-red-100 shadow"
            />
          </div>

          <label className="mt-3 cursor-pointer text-sm font-medium text-red-600 hover:underline">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* NAME */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            value={user.email}
            disabled
            className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-sm text-gray-500"
          />
        </div>

        {/* PHONE */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Phone
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        </div>

        {/* ADDRESS */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Address
          </label>
          <textarea
            name="address"
            rows={3}
            value={form.address}
            onChange={handleChange}
            className="w-full resize-none rounded-lg border px-3 py-2 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
