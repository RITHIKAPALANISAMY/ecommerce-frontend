import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  BarChart3,
} from "lucide-react";

export default function SellerLayout() {
  const navItems = [
    { name: "Dashboard", path: "/seller/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/seller/products", icon: Package },
    { name: "Orders", path: "/seller/orders", icon: ShoppingCart },
    { name: "Reviews", path: "/seller/reviews", icon: Star },
    { name: "Analytics", path: "/seller/analytics", icon: BarChart3 },
  ];

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-gray-100">

        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r shadow-sm p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-8">
            Seller Panel
          </h2>

          <nav className="space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-red-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-10">
          <Outlet />
        </main>

      </div>
    </>
  );
}