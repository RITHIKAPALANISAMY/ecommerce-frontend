import { useEffect, useState, useRef } from "react";
import "./Settings.css";

const Settings = () => {
  /* ===== DARK MODE ===== */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  /* ===== NOTIFICATIONS ===== */
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== "false"
  );

  /* 🔑 store previous value */
  const prevNotifications = useRef(notifications);

  /* ===== CHANGE PASSWORD FORM ===== */
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* 👁️ SHOW / HIDE PASSWORD STATES */
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ===== ADMIN PROFILE ===== */
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("adminProfile");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Admin",
          email: "admin@shopverse.com",
          phone: "",
        };
  });

  /* ===== APPLY DARK MODE ===== */
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  /* ===== NOTIFICATIONS (ONLY ON USER TOGGLE) ===== */
  useEffect(() => {
    localStorage.setItem("notifications", notifications);

    // ✅ show toast only if value actually changed
    if (prevNotifications.current !== notifications) {
      showToast(
        notifications
          ? "Notifications Enabled 🔔"
          : "Notifications Disabled 🔕",
        notifications ? "success" : "warning"
      );
    }

    prevNotifications.current = notifications;
  }, [notifications]);

  /* ===== TOAST ===== */
  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  /* ===== PASSWORD HANDLERS ===== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (form.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Password changed successfully");

    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  /* ===== PROFILE HANDLERS ===== */
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    localStorage.setItem("adminProfile", JSON.stringify(profile));
    showToast("Profile Updated 👤", "success");
  };

  return (
    <div className="settings-container">
      <h2>⚙️ Settings</h2>

      {/* ===== APPEARANCE ===== */}
      <div className="settings-card">
        <h3>Appearance</h3>

        <div className="setting-row">
          <div>
            <p className="setting-title">Dark Mode</p>
            <span className="setting-desc">
              Enable dark theme for admin dashboard
            </span>
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

      {/* ===== NOTIFICATIONS ===== */}
      <div className="settings-card">
        <h3>Notifications</h3>

        <div className="setting-row">
          <div>
            <p className="setting-title">Admin Notifications</p>
            <span className="setting-desc">
              Get alerts for new orders & updates
            </span>
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

      {/* ===== ADMIN PROFILE (SAFE) ===== */}
      <div className="settings-card">
        <h3>👤 Admin Profile</h3>

        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
          />
        </div>

        <button className="save-btn" onClick={saveProfile}>
          Save Profile
        </button>
      </div>

      {/* ===== CHANGE PASSWORD (SAFE + 👁️) ===== */}
      <div className="settings-card">
        <h3>Change Password</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group password-group">
            <label>Current Password</label>
            <div className="password-field">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
              />
              <span onClick={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className="form-group password-group">
            <label>New Password</label>
            <div className="password-field">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
              />
              <span onClick={() => setShowNew(!showNew)}>
                {showNew ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className="form-group password-group">
            <label>Confirm New Password</label>
            <div className="password-field">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <span onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button className="save-btn" type="submit">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
