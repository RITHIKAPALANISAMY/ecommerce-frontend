import { useEffect, useState, useRef } from "react";
import "./Settings.css";

const Settings = () => {
  /* ===== TOAST ===== */
  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  /* ===== DARK MODE ===== */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  /* ===== NOTIFICATIONS ===== */
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== "false"
  );
  const prevNotifications = useRef(notifications);

  /* ===== PASSWORD ===== */
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ===== PROFILE ===== */
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("adminProfile");
    return saved
      ? JSON.parse(saved)
      : { name: "Admin", email: "admin@shopverse.com", phone: "" };
  });

  /* ===== EFFECTS ===== */
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("notifications", notifications);
    if (prevNotifications.current !== notifications) {
      showToast(
        notifications ? "Notifications Enabled 🔔" : "Notifications Disabled 🔕",
        notifications ? "success" : "warning"
      );
    }
    prevNotifications.current = notifications;
  }, [notifications]);

  /* ===== HANDLERS ===== */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword)
      return alert("All fields required");
    if (form.newPassword.length < 6)
      return alert("Password must be at least 6 characters");
    if (form.newPassword !== form.confirmPassword)
      return alert("Passwords do not match");

    showToast("Password updated successfully 🔐");
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const saveProfile = () => {
    localStorage.setItem("adminProfile", JSON.stringify(profile));
    showToast("Profile Updated 👤");
  };

  return (
    <div className="settings-container">
      <h2>⚙️ Settings</h2>

      {/* APPEARANCE */}
      <div className="settings-card">
        <h3>Appearance</h3>
        <div className="setting-row">
          <div>
            <p className="setting-title">Dark Mode</p>
            <span className="setting-desc">Enable dark theme</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="settings-card">
        <h3>Notifications</h3>
        <div className="setting-row">
          <div>
            <p className="setting-title">Admin Notifications</p>
            <span className="setting-desc">Order & system alerts</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* PROFILE + PASSWORD SIDE BY SIDE */}
      <div className="settings-grid">
        {/* PROFILE */}
        <div className="settings-card">
          <h3>👤 Admin Profile</h3>

          <div className="form-group">
            <label>Name</label>
            <input name="name" value={profile.name} onChange={handleProfileChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" value={profile.email} onChange={handleProfileChange} />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={profile.phone} onChange={handleProfileChange} />
          </div>

          <button className="save-btn" onClick={saveProfile}>
            Save Profile
          </button>
        </div>

        {/* PASSWORD */}
        <div className="settings-card">
          <h3>🔐 Change Password</h3>

          <form onSubmit={handleSubmit}>
            {[
              ["currentPassword", showCurrent, setShowCurrent],
              ["newPassword", showNew, setShowNew],
              ["confirmPassword", showConfirm, setShowConfirm],
            ].map(([name, show, toggle], i) => (
              <div className="form-group" key={i}>
                <label>{name.replace(/([A-Z])/g, " $1")}</label>
                <div className="password-field">
                  <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                  />
                  <span onClick={() => toggle(!show)}>
                    {show ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>
            ))}

            <button className="save-btn" type="submit">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
