import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/profile.css";


export default function SettingsPage() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <p className="profile-error">Please login to view settings</p>;
  }

  /* ================= PREFERENCES ================= */
  const prefsKey = `prefs_${user.email}`;
  const [prefs, setPrefs] = useState(() => {
  return (
    JSON.parse(localStorage.getItem(prefsKey)) || {
      emailNotifications: true,
      orderUpdates: true,
    }
  );
});

  const togglePref = (key) => {
  const updated = { ...prefs, [key]: !prefs[key] };
  localStorage.setItem(prefsKey, JSON.stringify(updated));
  navigate(0);
};


  return (
    <div className="profile-page">
      <h2 className="profile-title">Settings</h2>

      {/* ===== ACCOUNT ===== */}
      <div className="profile-card">
        <h4>Account</h4>

        <div className="profile-row">
          <span>Username</span>
          <strong>{user.username}</strong>
        </div>

        <div className="profile-row">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>

        <div className="profile-row">
          <span>Role</span>
          <strong>{user.role}</strong>
        </div>
      </div>

     
      {/* ===== SECURITY ===== */}
      <div className="profile-card">
        <h4>Security</h4>

        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 12 }}>
          Change your password to keep your account secure.
        </p>

     <button
  className="btn danger-outline"
  onClick={() => navigate("/forgot-password")}
>
  Change Password
</button>


      </div>

      {/* ===== DANGER ZONE ===== */}
      <div className="profile-card danger">
        <h4 style={{ color: "#b11226" }}>Danger Zone</h4>

        <p style={{ fontSize: 14, color: "#7f1d1d", marginBottom: 14 }}>
          Logging out or deleting your account will remove your data from this
          device.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            className="btn secondary"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>

          <button
  className="btn danger-solid"
  onClick={() => {
    if (confirm("Delete account permanently? This cannot be undone.")) {
      deleteAccount();
      navigate("/signup");
    }
  }}
>
  Delete Account
</button>

        </div>
      </div>
    </div>
  );
}
