import { Routes, Route, Navigate } from "react-router-dom";

/* ================= ADMIN ================= */
import AdminRoutes from "./routes/AdminRoutes";
import AdminGuard from "./routes/AdminGuard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import OrdersAdmin from "./pages/admin/AdminOrders"; // ✅ FIXED
import Coupons from "./pages/admin/Coupons";
import Settings from "./pages/admin/Settings";

/* ================= SELLER ================= */
import SellerRoutes from "./routes/SellerRoutes";
import SellerLayout from "./layouts/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerOrders from "./pages/seller/SellerOrders";
import BecomeSeller from "./pages/seller/BecomeSeller";

/* ================= BUYER ================= */
import BuyerLayout from "./layouts/BuyerLayout";
import Home from "./pages/buyer/Home";
import ProductDetails from "./pages/buyer/ProductDetails";
import CategoryPage from "./pages/buyer/CategoryPage";
import SearchResults from "./pages/buyer/SearchResults";
import Cart from "./pages/buyer/Cart";
import BuyerOrders from "./pages/buyer/Orders";
import Wishlist from "./pages/buyer/Wishlist";

/* ================= CHECKOUT ================= */
import Checkout from "./pages/buyer/Checkout";
import CheckoutAddress from "./pages/buyer/CheckoutAddress";
import CheckoutSummary from "./pages/buyer/CheckoutSummary";
import CheckoutPayment from "./pages/buyer/CheckoutPayment";
import OrderSuccess from "./pages/buyer/OrderSuccess";

/* ================= AUTH ================= */
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";


import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import ProfilePage from "./components/common/ProfilePage";
import SettingsPage from "./components/common/SettingsPage";

export default function App() {
  return (
    <Routes>
      {/* ================= ADMIN (PROTECTED) ================= */}
      <Route element={<AdminGuard />}>
        <Route element={<AdminRoutes />}>
          <Route path="/admin">
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<OrdersAdmin />} /> {/* ✅ ADMIN ORDERS */}
            <Route path="coupons" element={<Coupons />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>

      {/* ================= SELLER ================= */}
      <Route element={<SellerRoutes />}>
        <Route element={<SellerLayout />}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
        </Route>
      </Route>

      {/* ================= BUYER ================= */}
      <Route element={<BuyerLayout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="category/:category" element={<CategoryPage />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<BuyerOrders />} /> {/* ✅ BUYER ORDERS */}
        <Route path="wishlist" element={<Wishlist />} />

        <Route path="checkout" element={<Checkout />}>
          <Route index element={<Navigate to="address" />} />
          <Route path="address" element={<CheckoutAddress />} />
          <Route path="summary" element={<CheckoutSummary />} />
          <Route path="payment" element={<CheckoutPayment />} />
        </Route>

        <Route path="order-success" element={<OrderSuccess />} />
      </Route>

      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={<ProfilePage />} />
      {/* ================= COMMON ================= */}
      <Route path="/become-seller" element={<BecomeSeller />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/settings" element={<SettingsPage />} />
      
    </Routes>
  );
}
