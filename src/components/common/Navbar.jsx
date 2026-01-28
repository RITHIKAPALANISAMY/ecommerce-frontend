import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "../../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce(
    (sum, item) => sum + (Number(item.qty) || 1),
    0
  );

  const role = user?.role;
  const username = user?.username || "User";

  /* CLOSE DROPDOWN ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* SEARCH */
  const handleSearchKey = (e) => {
    if (e.key !== "Enter" || !search.trim()) return;

    const match = location.pathname.match(/^\/category\/(.+)/);
    if (match) {
      navigate(`/category/${match[1]}?q=${encodeURIComponent(search)}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
    setSearch("");
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">ShopVerse</Link>

      <input
        className="search"
        placeholder="Search for Products, Brands and More"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearchKey}
      />

      <div className="nav-actions">
        {/* ================= NOT LOGGED IN ================= */}
        {!user && (
          <>
            <Link className="nav-link login-link" to="/login">Login</Link>
            <div
              className="nav-link seller-link"
              onClick={() => navigate("/become-seller")}
            >
              🏬 Become a Seller
            </div>
          </>
        )}

        {/* ================= LOGGED IN ================= */}
        {user && (
          <div className="user-wrapper" ref={dropdownRef}>
            {role === "buyer" && (
              <div
                className="nav-link seller-link"
                onClick={() => navigate("/become-seller")}
              >
                🏬 Become a Seller
              </div>
            )}

            <div
              className="nav-link user-nav-link"
              onClick={() => setOpen(!open)}
            >
              👤 <span className="user-name">{username}</span>
            </div>

            {open && (
              <div className="user-dropdown">
                <div className="user-top">
                  <strong>{username}</strong>
                  <p>{user.email}</p>
                  <span className="user-role">
                    {role === "buyer" && "Buyer Account"}
                    {role === "seller" && "Seller Account"}
                    {role === "admin" && "Admin Account"}
                  </span>
                </div>

                {/* COMMON */}
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setOpen(false)}
                >
                  👤 My Profile
                </Link>

                <Link
                  to="/settings"
                  className="dropdown-item"
                  onClick={() => setOpen(false)}
                >
                  ⚙️ Settings
                </Link>

                {/* BUYER */}
                {role === "buyer" && (
                  <>
                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={() => setOpen(false)}
                    >
                      📦 My Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      className="dropdown-item"
                      onClick={() => setOpen(false)}
                    >
                      ❤️ Wishlist
                    </Link>
                  </>
                )}

                {/* SELLER */}
                {role === "seller" && (
                  <Link
                    to="/seller/dashboard"
                    className="dropdown-item"
                    onClick={() => setOpen(false)}
                  >
                    🏪 Seller Dashboard
                  </Link>
                )}

                {/* ADMIN */}
                {role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="dropdown-item"
                    onClick={() => setOpen(false)}
                  >
                    🛠 Admin Dashboard
                  </Link>
                )}

                <button
                  className="dropdown-logout"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* CART */}
        <div className="cart" onClick={() => navigate("/cart")}>
          🛒
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </div>
      </div>
    </nav>
  );
}
