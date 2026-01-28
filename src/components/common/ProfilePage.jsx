import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import { useWishlist } from "../../context/WishlistContext";
import EditProfileModal from "../../components/common/EditProfileModal";
import "../../styles/profile.css";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { cartItems } = useCart();
  const { orders } = useOrders();
  const { wishlist } = useWishlist();

  const [openEdit, setOpenEdit] = useState(false);

  if (!user) {
    return <p className="profile-error">Please login to view profile</p>;
  }

  /* ✅ REAL-TIME STATS (DERIVED FROM CONTEXTS) */
  const userOrders = orders.filter(
    (o) => o.buyerEmail === user.email
  );

  const stats = {
    orders: userOrders.length,
    wishlist: wishlist.length,
    cart: cartItems.reduce((sum, i) => sum + i.qty, 0),
    reviews: userOrders.reduce(
      (count, o) =>
        count +
        o.items.filter((i) => i.reviewed).length,
      0
    ),
  };

  const handleSave = (data) => {
    updateUser(data);
    setOpenEdit(false);
  };

  return (
    <div className="profile-page">
      <h2 className="profile-title">My Profile</h2>

      {/* ===== HEADER ===== */}
      <div className="profile-header-card">
        <div className="profile-avatar-lg">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <div className="profile-header-info">
          <h3>{user.username}</h3>
          <p>{user.email}</p>

          <div className="profile-tags">
            <span className={`tag ${user.role}`}>{user.role}</span>
            <span className="tag verified">Verified</span>
            <span className="tag active">Active</span>
          </div>

          <button
            className="btn primary"
            onClick={() => setOpenEdit(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* ===== REAL-TIME STATS ===== */}
      <div className="profile-stats">
        <div className="stat-box">
          <strong>{stats.orders}</strong>
          <span>Orders</span>
        </div>
        <div className="stat-box">
          <strong>{stats.wishlist}</strong>
          <span>Wishlist</span>
        </div>
        <div className="stat-box">
          <strong>{stats.cart}</strong>
          <span>Cart Items</span>
        </div>
        <div className="stat-box">
          <strong>{stats.reviews}</strong>
          <span>Reviews</span>
        </div>
      </div>

      {/* ===== DETAILS ===== */}
      <div className="profile-grid">
        <div className="profile-card">
          <h4>Account Details</h4>

          <div className="profile-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>

          <div className="profile-row">
            <span>Status</span>
            <strong>Active</strong>
          </div>

          <div className="profile-row">
            <span>Joined</span>
            <strong>Jan 2025</strong>
          </div>
        </div>

        <div className="profile-card">
          <h4>Contact</h4>

          <div className="profile-row">
            <span>Phone</span>
            <strong>{user.phone || "Not added"}</strong>
          </div>

          <div className="profile-row">
            <span>Address</span>
            <strong>{user.address || "Not added"}</strong>
          </div>
        </div>
      </div>

      {openEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setOpenEdit(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
