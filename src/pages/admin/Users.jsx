import { useEffect, useState } from "react";

const STORAGE_KEY = "admin_users";

const defaultUsers = [
  {
    id: 1,
    name: "Arun Kumar",
    email: "arun@gmail.com",
    role: "Buyer",
    status: "Active",
    approved: true,
    suspicious: false,
  },
  {
    id: 2,
    name: "Priya S",
    email: "priya@gmail.com",
    role: "Seller",
    status: "Active",
    approved: false,
    suspicious: false,
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const [viewUser, setViewUser] = useState(null);

  /* ===== persist ===== */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  /* ===== generic admin action ===== */
  const handleUserAction = (action, user) => {
    switch (action) {
      case "block":
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" }
              : u
          )
        );
        break;

      case "approve":
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, approved: true } : u
          )
        );
        break;

      case "flag":
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, suspicious: !u.suspicious } : u
          )
        );
        break;

      case "view":
        setViewUser(user);
        break;

      default:
        console.log("Future action:", action, user);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Users Management</h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Approval</th>
              <th className="p-3">Risk</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>

                <td className="p-3">
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-600">
                    {u.role}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      u.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="p-3">
                  {u.approved ? (
                    <span className="text-green-600 font-semibold">
                      Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleUserAction("approve", u)}
                      className="text-xs px-3 py-1 bg-primary text-white rounded"
                    >
                      Approve
                    </button>
                  )}
                </td>

                <td className="p-3">
                  {u.suspicious ? (
                    <span className="text-red-600">⚠ Flagged</span>
                  ) : (
                    <span className="text-green-600">Safe</span>
                  )}
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleUserAction("view", u)}
                    className="text-primary text-xs"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleUserAction("block", u)}
                    className="text-xs text-red-600"
                  >
                    {u.status === "Blocked" ? "Unblock" : "Block"}
                  </button>

                  <button
                    onClick={() => handleUserAction("flag", u)}
                    className="text-xs text-orange-600"
                  >
                    {u.suspicious ? "Unflag" : "Flag"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW PANEL */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[320px]">
            <h3 className="font-semibold mb-3">User Details</h3>
            <p><b>Name:</b> {viewUser.name}</p>
            <p><b>Email:</b> {viewUser.email}</p>
            <p><b>Role:</b> {viewUser.role}</p>
            <p><b>Status:</b> {viewUser.status}</p>

            <button
              onClick={() => setViewUser(null)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}