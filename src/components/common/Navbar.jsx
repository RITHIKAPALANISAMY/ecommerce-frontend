import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const isSeller = user?.role === "seller";

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

  return (
    <nav className="navbar">
      {/* LOGO */}
      <Link to="/" className="logo">
        ShopVerse
      </Link>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search for Products, Brands and More"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearchKey}
      />

      <div className="nav-actions">
        {/* ================= BEFORE LOGIN ================= */}
        {!user && (
          <>
            <Link className="nav-link login-link" to="/login">
              Login
            </Link>

            <div
              className="nav-link seller-link"
              onClick={() => navigate("/become-seller")}
            >
              🏬 <span>Become a Seller</span>
            </div>
          </>
        )}

        {/* ================= AFTER LOGIN ================= */}
        {user && (
          <>
            {/* SHOW ONLY IF USER IS NOT SELLER */}
            {!isSeller && (
              <div
                className="nav-link seller-link"
                onClick={() => navigate("/become-seller")}
              >
                🏬 <span>Become a Seller</span>
              </div>
            )}

            {/* USER DROPDOWN */}
            <div className="user-wrapper" ref={dropdownRef}>
              <div
                className="nav-link user-nav-link"
                onClick={() => setOpen((o) => !o)}
              >
                👤
                <span className="user-name">
                  {user.email.split("@")[0]}
                </span>
              </div>

              {open && (
                <div className="user-dropdown">
                  <div className="user-top">
                    <strong>{user.email.split("@")[0]}</strong>
                    <p>{user.email}</p>
                    <span className="user-role">
                      {isSeller ? "Seller Account" : "Buyer Account"}
                    </span>
                  </div>

                  <Link
                    to={isSeller ? "/seller/dashboard" : "/orders"}
                    className="dropdown-item"
                  >
                    ⬜ {isSeller ? "Seller Dashboard" : "My Dashboard"}
                  </Link>

                  <button
                    className="dropdown-logout"
                    onClick={logout}
                  >
                    ➜ Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* CART */}
        <div className="cart" onClick={() => navigate("/cart")}>
          🛒 {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </div>
      </div>
    </nav>
  );
}
