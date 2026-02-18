import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SettingsPage() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <p className="mt-10 text-center text-red-600">
        Please login to view settings
      </p>
    );
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
    setPrefs(updated);
    localStorage.setItem(prefsKey, JSON.stringify(updated));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Settings
      </h2>

      {/* ================= ACCOUNT ================= */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h4 className="mb-4 text-lg font-medium text-gray-800">
          Account
        </h4>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Username</span>
            <span className="font-medium">{user.username}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span className="font-medium capitalize">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* ================= PREFERENCES ================= */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h4 className="mb-4 text-lg font-medium text-gray-800">
          Preferences
        </h4>

        <div className="space-y-4">
          <ToggleRow
            label="Email Notifications"
            enabled={prefs.emailNotifications}
            onToggle={() => togglePref("emailNotifications")}
          />

          <ToggleRow
            label="Order Updates"
            enabled={prefs.orderUpdates}
            onToggle={() => togglePref("orderUpdates")}
          />
        </div>
      </div>

      {/* ================= SECURITY ================= */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h4 className="mb-2 text-lg font-medium text-gray-800">
          Security
        </h4>

        <p className="mb-4 text-sm text-gray-500">
          Change your password to keep your account secure.
        </p>

        <button
          onClick={() => navigate("/forgot-password")}
          className="rounded-md border border-red-600 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Change Password
        </button>
      </div>

      
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h4 className="mb-2 text-lg font-semibold text-red-700">
          Danger Zone
        </h4>

        <p className="mb-4 text-sm text-red-600">
          Logging out or deleting your account will remove your data
          from this device.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="rounded-md bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            Logout
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  "Delete account permanently? This cannot be undone."
                )
              ) {
                deleteAccount();
                navigate("/signup");
              }
            }}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}


function ToggleRow({ label, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>

      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          enabled ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
