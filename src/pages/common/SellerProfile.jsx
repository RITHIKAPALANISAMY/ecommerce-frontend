import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  User,
  ShieldCheck,
  Edit3,
  Lock,
  Camera,
  BadgeCheck,
  Store,
  MapPin,
  FileText
} from "lucide-react";
import Swal from "sweetalert2";
import {
  updateUserProfile,
  deleteUserAccount,
  uploadProfileImage
} from "../../api/userService";
import { useAuth } from "../../context/AuthContext";

const SellerProfile = () => {
  const { user, refreshUser, logout } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();

  /* ================= LOAD LATEST USER ================= */
  useEffect(() => {
    refreshUser();
  }, []);

  if (!user) return null;

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
  const handleChangePassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 animate-fadeIn">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-3xl shadow-xl p-8 flex justify-between items-center 
      hover:shadow-2xl hover:-translate-y-1 transition duration-300">

        <div className="flex items-center gap-6">

          {user.profileImage ? (
            <div className="relative group">
              <img
                src={`http://localhost:8081${user.profileImage}`}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-red-600 
                shadow-lg hover:scale-105 transition duration-300"
              />
              {user.verified && (
                <BadgeCheck className="absolute bottom-1 right-1 text-red-600 bg-white rounded-full" />
              )}
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-600 to-red-700 
            text-white flex items-center justify-center text-3xl font-bold shadow-lg">
              {user.name?.charAt(0)}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-red-600 font-medium">Seller Account</p>

            <span
              className={`mt-2 inline-block px-4 py-1 rounded-full text-sm font-medium
              ${user.verified
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {user.verified ? "Approved Seller" : "Pending Approval"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsEditOpen(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 
          rounded-full hover:bg-red-700 hover:scale-105 transition duration-300 shadow-md"
        >
          <Edit3 size={18} />
          Edit Profile
        </button>
      </div>

      {/* ================= PERSONAL INFO ================= */}
      <Section title="Personal Information">
        <ProfileItem icon={<User size={18} />} label="Full Name" value={user.name} />
        <ProfileItem icon={<Mail size={18} />} label="Email" value={user.email} />
        <ProfileItem icon={<Phone size={18} />} label="Phone" value={user.phone || "Not Provided"} />
        <ProfileItem icon={<ShieldCheck size={18} />} label="Gender" value={user.gender || "Not Provided"} />
      </Section>

      {/* ================= STORE INFO ================= */}
      <Section title="Store Information">
        <ProfileItem icon={<Store size={18} />} label="Store Name" value={user.storeName || "Not Provided"} />
        <ProfileItem icon={<FileText size={18} />} label="GST Number" value={user.gstNumber || "Not Provided"} />
        <ProfileItem icon={<Phone size={18} />} label="Store Phone" value={user.storePhone || "Not Provided"} />
        <ProfileItem icon={<MapPin size={18} />} label="Store Address" value={user.storeAddress || "Not Provided"} />
      </Section>

      {/* ================= ACCOUNT ACTIONS ================= */}
      <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 
      hover:shadow-2xl hover:-translate-y-1 transition duration-300 animate-fadeIn">
        <h2 className="text-2xl font-semibold">Account Actions</h2>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleChangePassword}
            className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2 
            rounded-full hover:bg-black hover:scale-105 transition duration-300"
          >
            <Lock size={16} />
            Change Password
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-2 rounded-full 
            hover:bg-red-700 hover:scale-105 transition duration-300"
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

/* ================= SECTION COMPONENT ================= */
const Section = ({ title, children }) => (
  <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 
  hover:shadow-2xl hover:-translate-y-1 transition duration-300 animate-fadeIn">
    <h2 className="text-2xl font-semibold">{title}</h2>
    <div className="grid md:grid-cols-2 gap-6">{children}</div>
  </div>
);

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
          <div className="flex justify-center">
            <label className="relative cursor-pointer group">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-red-600 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow">
                  <Camera className="text-gray-500" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Phone"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <select
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
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
              className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition shadow-md"
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
    <div className="text-red-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  </div>
);

export default SellerProfile;