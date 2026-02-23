import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../components/common/Navbar";

export default function SellerLayout() {
  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-gray-50">

        {/* SIDEBAR */}
        <aside className="w-64 bg-white shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Seller Panel
          </h2>

          <nav className="space-y-3">

            <NavLink
              to="/seller/dashboard"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/seller/orders"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Orders
            </NavLink>

            <NavLink
              to="/seller/reviews"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              Reviews
            </NavLink>

          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>
    </>
  );
}