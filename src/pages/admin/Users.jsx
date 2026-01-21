import { useState } from "react";
import "./Users.css";

const initialUsers = [
  {
    id: 1,
    name: "Arun Kumar",
    email: "arun@gmail.com",
    role: "Buyer",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya S",
    email: "priya@gmail.com",
    role: "Seller",
    status: "Active",
  },
  {
    id: 3,
    name: "Rahul M",
    email: "rahul@gmail.com",
    role: "Buyer",
    status: "Blocked",
  },
  {
    id: 4,
    name: "Sneha R",
    email: "sneha@gmail.com",
    role: "Seller",
    status: "Active",
  },
];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [viewUser, setViewUser] = useState(null);

  // BLOCK / UNBLOCK
  const toggleBlock = (id) => {
    setUsers(users.map(user =>
      user.id === id
        ? { ...user, status: user.status === "Active" ? "Blocked" : "Active" }
        : user
    ));
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
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>
                <span className={`badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </td>

              <td>
                <span className={`status ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </td>

              <td className="actions">
                <button
                  className="view-btn"
                  onClick={() => setViewUser(user)}
                >
                  View
                </button>

                <button
                  className={`block-btn ${user.status === "Blocked" ? "unblock" : ""}`}
                  onClick={() => toggleBlock(user.id)}
                >
                  {user.status === "Blocked" ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* VIEW MODAL */}
      {viewUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>User Details</h3>
            <p><b>Name:</b> {viewUser.name}</p>
            <p><b>Email:</b> {viewUser.email}</p>
            <p><b>Role:</b> {viewUser.role}</p>
            <p><b>Status:</b> {viewUser.status}</p>

            <button onClick={() => setViewUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
