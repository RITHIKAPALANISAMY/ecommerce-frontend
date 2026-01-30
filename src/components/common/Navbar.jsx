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

  const cartCount = cartItems.reduce(
    (sum, item) => sum + (Number(item.qty) || 1),
    0
  );

  const role = user?.role;
  const username = user?.username || "User";

  /* CLOSE DROPDOWN */
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
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="w-full px-6">
        <div className="flex items-center gap-6 py-3">

          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-red-600 tracking-tight shrink-0"
          >
            ShopVerse
          </Link>

          {/* SEARCH */}
          <div className="flex-1 hidden md:flex">
            <div className="relative w-full max-w-3xl mx-auto">
              <input
                className="w-full rounded-full border border-gray-300 bg-gray-50 px-5 py-2.5 text-sm focus:border-red-500 focus:bg-white focus:outline-none"
                placeholder="Search for products, brands and more"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKey}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-5">

            {/* LOGIN (GUEST) */}
            {!user && (
              <Link
                to="/login"
                className="text-sm font-medium hover:text-red-600"
              >
                Login
              </Link>
            )}

            {/* ✅ BECOME SELLER — SHOW FOR GUEST & BUYER ONLY */}
            {user?.role !== "seller" && (
              <button
                onClick={() => navigate("/become-seller")}
                className="hidden sm:block rounded-full border border-red-600 px-4 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
              >
                🏬 Become a Seller
              </button>
            )}

            {/* USER DROPDOWN */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium hover:bg-gray-100"
                >
                  👤 <span>{username}</span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-60 rounded-xl bg-white shadow-xl border overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold">{username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                        {role === "buyer" && "Buyer Account"}
                        {role === "seller" && "Seller Account"}
                        {role === "admin" && "Admin Account"}
                      </span>
                    </div>

                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      👤 My Profile
                    </Link>

                    <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      ⚙️ Settings
                    </Link>

                    {role === "buyer" && (
                      <>
                        <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">
                          📦 My Orders
                        </Link>
                        <Link to="/wishlist" className="block px-4 py-2 text-sm hover:bg-gray-50">
                          ❤️ Wishlist
                        </Link>
                      </>
                    )}

                    {role === "seller" && (
                      <Link to="/seller/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50">
                        🏪 Seller Dashboard
                      </Link>
                    )}

                    {role === "admin" && (
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50">
                        🛠 Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full border-t px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CART */}
            <button
              onClick={() => navigate("/cart")}
              className="relative text-2xl"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}
