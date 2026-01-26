import { useState } from "react";

const AdminProfile = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("adminProfile");
    return saved
      ? JSON.parse(saved)
      : { name: "Admin", email: "admin@shoverse.com", phone: "" };
  });

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = () => {
    localStorage.setItem("adminProfile", JSON.stringify(profile));
    alert("Profile updated");
  };

  return (
    <div className="settings-card">
      <h3>👤 Admin Profile</h3>

      <div className="form-group">
        <label>Name</label>
        <input name="name" value={profile.name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input name="email" value={profile.email} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input name="phone" value={profile.phone} onChange={handleChange} />
      </div>

      <button className="save-btn" onClick={handleSave}>
        Save Profile
      </button>
    </div>
  );
};

export default AdminProfile;
