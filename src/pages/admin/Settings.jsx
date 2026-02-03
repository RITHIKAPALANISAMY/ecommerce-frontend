import { useEffect, useState } from "react";

export default function Settings() {
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== "false"
  );
  const [notifyMsg, setNotifyMsg] = useState("");

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("adminProfile");
    return saved
      ? JSON.parse(saved)
      : { name: "Admin", email: "admin@shopverse.com", phone: "" };
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  useEffect(() => {
    localStorage.setItem("notifications", notifications);
  }, [notifications]);

  const toggleNotifications = () => {
    const next = !notifications;
    setNotifications(next);
    setNotifyMsg(
      next ? "Notifications enabled" : "Notifications disabled"
    );
    setTimeout(() => setNotifyMsg(""), 2000);
  };

  const saveProfile = () => {
    localStorage.setItem("adminProfile", JSON.stringify(profile));
    alert("Profile updated");
  };

  const updatePassword = (e) => {
    e.preventDefault();

    if (!passwords.current || !passwords.next || !passwords.confirm)
      return alert("All fields required");

    if (passwords.next.length < 6)
      return alert("Password too short");

    if (passwords.next !== passwords.confirm)
      return alert("Passwords do not match");

    alert("Password updated");
    setPasswords({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">⚙️ Admin Settings</h2>

      {/* NOTIFICATIONS */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="font-semibold mb-4">Notifications</h3>

        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Admin Alerts</p>
            <p className="text-sm text-gray-500">
              Orders & system updates
            </p>
            {notifyMsg && (
              <p className="text-sm text-green-600 mt-1">{notifyMsg}</p>
            )}
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={toggleNotifications}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#931012]
              after:content-[''] after:absolute after:top-0.5 after:left-[2px]
              after:bg-white after:h-5 after:w-5 after:rounded-full
              after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PROFILE */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">👤 Admin Profile</h3>

          {["name", "email", "phone"].map((field) => (
            <div key={field} className="mb-3">
              <label className="text-sm capitalize">{field}</label>
              <input
                value={profile[field]}
                onChange={(e) =>
                  setProfile({ ...profile, [field]: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}

          <button
            onClick={saveProfile}
            className="mt-3 bg-[#931012] text-white px-4 py-2 rounded"
          >
            Save Profile
          </button>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">🔐 Change Password</h3>

          <form onSubmit={updatePassword}>
            {[
              ["current", "Current Password"],
              ["next", "New Password"],
              ["confirm", "Confirm Password"],
            ].map(([key, label]) => (
              <div key={key} className="mb-3">
                <label className="text-sm">{label}</label>
                <div className="flex items-center border rounded px-3 py-2">
                  <input
                    type={show[key] ? "text" : "password"}
                    value={passwords[key]}
                    onChange={(e) =>
                      setPasswords({ ...passwords, [key]: e.target.value })
                    }
                    className="flex-1 outline-none"
                  />
                  <span
                    onClick={() =>
                      setShow({ ...show, [key]: !show[key] })
                    }
                    className="cursor-pointer"
                  >
                    {show[key] ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="mt-3 bg-[#931012] text-white px-4 py-2 rounded"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}