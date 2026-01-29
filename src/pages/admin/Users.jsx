import { useEffect, useState } from "react";
import "./Users.css";

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
  {
    id: 3,
    name: "Rahul M",
    email: "rahul@gmail.com",
    role: "Buyer",
    status: "Blocked",
    approved: true,
    suspicious: true,
  },
  {
    id: 4,
    name: "Sneha R",
    email: "sneha@gmail.com",
    role: "Seller",
    status: "Active",
    approved: true,
    suspicious: false,
  },
];

const Users = () => {
  /* ===== STATE ===== */
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const [viewUser, setViewUser] = useState(null);

  /* ===== SAVE TO STORAGE ===== */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  /* ===== BLOCK / UNBLOCK ===== */
  const toggleBlock = (user) => {
    const action = user.status === "Active" ? "Block" : "Unblock";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" }
          : u
      )
    );
  };

  /* ===== APPROVE USER ===== */
  const approveUser = (user) => {
    if (!window.confirm("Approve this user?")) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, approved: true } : u
      )
    );
  };

  /* ===== FLAG SUSPICIOUS ===== */
  const toggleSuspicious = (user) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, suspicious: !u.suspicious }
          : u
      )
    );
  };

  return (
    <div className="users-page">
      <h2 className="page-title">Users Management</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Approval</th>
            <th>Risk</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              {/* NAME */}
              <td className="name-cell">
                <div className="user-name">{user.name}</div>
              </td>

              {/* EMAIL */}
              <td className="email-cell">{user.email}</td>

              {/* ROLE */}
              <td>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </td>

              {/* STATUS */}
              <td>
                <span className={`status-badge ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </td>

              {/* APPROVAL */}
              <td>
                {user.approved ? (
                  <span className="approved-badge">Approved</span>
                ) : (
                  <button
                    className="approve-btn"
                    onClick={() => approveUser(user)}
                  >
                    Approve
                  </button>
                )}
              </td>

              {/* SUSPICIOUS */}
              <td>
                {user.suspicious ? (
                  <span className="risk-badge">⚠ Flagged</span>
                ) : (
                  <span className="safe-badge">Safe</span>
                )}
              </td>

              {/* ACTIONS */}
              <td className="actions">
                <button className="view-btn" onClick={() => setViewUser(user)}>
                  View
                </button>

                <button
                  className={`block-btn ${
                    user.status === "Blocked" ? "unblock" : ""
                  }`}
                  onClick={() => toggleBlock(user)}
                >
                  {user.status === "Blocked" ? "Unblock" : "Block"}
                </button>

                <button
                  className="flag-btn"
                  onClick={() => toggleSuspicious(user)}
                >
                  {user.suspicious ? "Unflag" : "Flag"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== VIEW MODAL ===== */}
      {viewUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>User Details</h3>
            <p><b>Name:</b> {viewUser.name}</p>
            <p><b>Email:</b> {viewUser.email}</p>
            <p><b>Role:</b> {viewUser.role}</p>
            <p><b>Status:</b> {viewUser.status}</p>
            <p><b>Approved:</b> {viewUser.approved ? "Yes" : "No"}</p>
            <p><b>Suspicious:</b> {viewUser.suspicious ? "Yes" : "No"}</p>

            <button className="close-btn" onClick={() => setViewUser(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
