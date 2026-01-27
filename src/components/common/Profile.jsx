import { useAuth } from "../../context/AuthContext";
import "../../styles/profile.css";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <div className="profile-card">
        {/* HEADER */}
        <div className="profile-header">
          <div className="avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{user.username}</h3>
            <span className={`role ${user.role}`}>
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* ACCOUNT */}
        <div className="profile-section">
          <h4>Account Details</h4>

          <div className="profile-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>
        </div>

        {/* CONTACT */}
        <div className="profile-section">
          <h4>Contact</h4>

          <div className="profile-row">
            <span>Phone</span>
            <strong>{user.phone || "Not added"}</strong>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="profile-section">
          <h4>Address</h4>

          {user.address ? (
            <p className="address">{user.address}</p>
          ) : (
            <p className="muted">No address saved</p>
          )}
        </div>
      </div>
    </div>
  );
}
