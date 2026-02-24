import React, { useState } from "react";
 import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  User,
  ShieldCheck,
  Edit3,
  Lock,
  Camera
} from "lucide-react";
import Swal from "sweetalert2";
import {
  updateUserProfile,
  deleteUserAccount,
  uploadProfileImage,
  changeUserPassword
} from "../../api/userService";
import { useAuth } from "../../context/AuthContext";

const BuyerProfile = ({ user }) => {
  const { refreshUser, logout } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  /* ================= DELETE ACCOUNT ================= */
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Account?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      await deleteUserAccount();
      logout();
      Swal.fire("Deleted!", "Your account has been deleted.", "success");
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const navigate = useNavigate();

const handleChangePassword = () => {
  navigate("/forgot-password");
};

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 animate-fadeIn">

      {/* HEADER */}
      <div className="bg-white rounded-3xl shadow-xl p-8 flex justify-between items-center hover:shadow-2xl transition">

        <div className="flex items-center gap-6">

          {user.profileImage ? (
            <img
              src={`http://localhost:8081${user.profileImage}`}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
              {user.name?.charAt(0)}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-500">Buyer Account</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 hover:scale-105 transition duration-300 shadow-md"
        >
          <Edit3 size={18} />
          Edit Profile
        </button>
      </div>

      {/* PERSONAL INFO */}
      <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold">Personal Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <ProfileItem icon={<User size={18} />} label="Full Name" value={user.name} />
          <ProfileItem icon={<Mail size={18} />} label="Email" value={user.email} />
          <ProfileItem icon={<Phone size={18} />} label="Phone" value={user.phone || "Not Provided"} />
          <ProfileItem icon={<ShieldCheck size={18} />} label="Gender" value={user.gender || "Not Provided"} />
        </div>
      </div>

      {/* ACCOUNT ACTIONS */}
      <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold">Account Actions</h2>

        <div className="flex flex-wrap gap-4">
          <button
  onClick={handleChangePassword}
  className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-black hover:scale-105 transition"
>
  <Lock size={16} />
  Change Password
</button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 hover:scale-105 transition"
          >
            Delete Account
          </button>
        </div>
      </div>

      {isEditOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditOpen(false)}
          refreshUser={refreshUser}
        />
      )}
    </div>
  );
};

/* ================= EDIT MODAL ================= */
const EditProfileModal = ({ user, onClose, refreshUser }) => {
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    gender: user.gender || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(
    user.profileImage
      ? `http://localhost:8081${user.profileImage}`
      : null
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUserProfile(form);

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        await uploadProfileImage(formData);
      }

      await refreshUser();
      Swal.fire("Updated!", "Profile updated successfully.", "success");
      onClose();
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">

      <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-scaleUp">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ROUND IMAGE UPLOAD */}
          <div className="flex justify-center">

            <label className="relative cursor-pointer group">

              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow">
                  <Camera className="text-gray-500" />
                </div>
              )}

              <div className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full text-white shadow-md opacity-0 group-hover:opacity-100 transition">
                <Camera size={16} />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* FORM FIELDS */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Phone"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <select
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-md"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

/* ================= PROFILE ITEM ================= */
const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition shadow-sm">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  </div>
);

export default BuyerProfile;