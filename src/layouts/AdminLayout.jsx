import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Ticket,
  Percent,
  BarChart3,
  CreditCard,
  RotateCcw,
  RefreshCcw,
  Settings as SettingsIcon,
  Store
} from "lucide-react";

const TABS = [
  { label: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: Users },

  // ✅ NEW SELLER REQUESTS TAB
  { label: "Seller Requests", path: "/admin/seller-requests", icon: Store },

  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { label: "Coupons", path: "/admin/coupons", icon: Ticket },
  { label: "Deals", path: "/admin/deals", icon: Percent },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Payments", path: "/admin/payments", icon: CreditCard },
  { label: "Returns", path: "/admin/returns", icon: RotateCcw },
  { label: "Refunds", path: "/admin/refunds", icon: RefreshCcw },
  { label: "Settings", path: "/admin/settings", icon: SettingsIcon },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 pt-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-[#931012] text-white px-8 py-6 rounded-2xl flex justify-between items-center shadow">
          <div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm opacity-90">
              Complete platform control and management
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="bg-white text-[#931012] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 px-4">
        <div className="bg-white rounded-xl shadow">
          <div className="flex justify-between px-6 py-4 text-sm font-medium overflow-x-auto">
            {TABS.map((tab) => {
              const active = location.pathname === tab.path;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`flex items-center gap-2 pb-2 transition whitespace-nowrap ${
                    active
                      ? "text-[#931012] border-b-2 border-[#931012]"
                      : "text-gray-600 hover:text-[#931012]"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </div>
    </div>
  );
}
