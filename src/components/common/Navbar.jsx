import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useCompare } from "../../context/CompareContext";
import {
  Search,
  User,
  ShoppingCart,
  Package,
  Heart,
  BarChart3,
  Settings,
  LogOut,
  Store
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { compareItems } = useCompare();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce(
    (sum, item) => sum + (Number(item.qty) || 1),
    0
  );

  const compareCount = compareItems.length;
  const isCheckoutPage = location.pathname.startsWith("/checkout");

  // ✅ Normalize role properly
 const role = user?.role;

  const username =
  user?.name || user?.fullName || user?.username || "User";



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
    navigate(
      match
        ? `/category/${match[1]}?q=${encodeURIComponent(search)}`
        : `/search?q=${encodeURIComponent(search)}`
    );
    setSearch("");
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="w-full px-6">
        <div className="flex items-center gap-6 py-3">

          {/* LOGO */}
          <Link to="/" className="shrink-0 text-2xl font-extrabold text-red-600">
            ShopVerse
          </Link>

          {/* SEARCH */}
          <div className="hidden flex-1 md:flex">
            <div className="relative mx-auto w-full max-w-3xl">
              <input
                className="w-full rounded-full border bg-gray-50 px-5 py-2.5 text-sm
                           focus:border-red-500 focus:bg-white focus:outline-none focus:shadow-md"
                placeholder="Search for products, brands and more"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKey}
              />
              <Search
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-5">

            {!user && (
              <Link to="/login" className="text-sm font-medium hover:text-red-600">
                Login
              </Link>
            )}

            {/* Become Seller button */}
            {role !== "SELLER" && user && (
              <button
                onClick={() => navigate("/become-seller")}
                className="hidden sm:flex items-center gap-2 rounded-full border border-red-600
                           px-4 py-1.5 text-sm text-red-600 hover:bg-red-600 hover:text-white"
              >
                <Store size={16} />
                Become a Seller
              </button>
            )}

            {/* USER DROPDOWN */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-gray-100"
                >
                  <User size={18} />
                  {username}
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-64 rounded-xl border bg-white shadow-2xl overflow-hidden">

                    {/* HEADER */}
                    <div className="border-b bg-gray-50 px-4 py-3">
                      <p className="font-semibold">{username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                        {role} Account
                      </span>
                    </div>

                    {/* COMMON */}
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <User size={16} /> My Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <Settings size={16} /> Settings
                    </Link>

                    {/* BUYER OPTIONS */}
                    {role === "BUYER" && (
                      <>
                        <Link
                          to="/orders"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <Package size={16} /> My Orders
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <Heart size={16} /> Wishlist
                        </Link>

                        {!isCheckoutPage && (
                          <button
                            disabled={compareCount < 2}
                            onClick={() => {
                              navigate("/compare");
                              setOpen(false);
                            }}
                            className={`flex w-full items-center justify-between px-4 py-2 text-sm
                              ${compareCount < 2
                                ? "cursor-not-allowed text-gray-400"
                                : "hover:bg-gray-50"
                              }`}
                          >
                            <span className="flex items-center gap-2">
                              <BarChart3 size={16} />
                              Compare Products
                            </span>

                            {compareCount > 0 && (
                              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                                {compareCount}
                              </span>
                            )}
                          </button>
                        )}
                      </>
                    )}

                    {/* SELLER */}
                    {role === "SELLER" && (
                      <Link
                        to="/seller/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        <Store size={16} /> Seller Dashboard
                      </Link>
                    )}

                    {/* ADMIN */}
                    {role === "ADMIN" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        <Settings size={16} /> Admin Dashboard
                      </Link>
                    )}

                    {/* LOGOUT */}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 border-t px-4 py-2
                                 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>

                  </div>
                )}
              </div>
            )}

            {/* CART */}
            <button onClick={() => navigate("/cart")} className="relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center
                                 rounded-full bg-red-600 text-xs text-white">
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
