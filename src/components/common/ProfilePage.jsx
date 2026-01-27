import { useAuth } from "../../context/AuthContext";
import "../../styles/profile.css";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <p className="profile-error">Please login to view profile</p>;
  }

  return (
    <div className="profile-page">
      <h2 className="profile-title">My Profile</h2>

      <div className="profile-card">
        <div className="profile-avatar">
          👤
        </div>

        <div className="profile-info">
          <div className="profile-row">
            <span>Name</span>
            <strong>{user.username}</strong>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <span className={`role-badge ${user.role}`}>
              {user.role}
            </span>
          </div>
          <div className="profile-actions">
  <button className="profile-btn primary">Edit Profile</button>

  {user.role === "seller" && (
    <button className="profile-btn secondary">
      Seller Dashboard
    </button>
  )}
</div>

        </div>
      </div>
    </div>
  );
}
