import { Routes, Route, Navigate } from "react-router-dom";
import CompareBar from "./components/common/CompareBar";
import "./index.css";

/* ================= ROUTE GUARDS ================= */
import ProtectedRoute from "./routes/ProtectedRoute";

/* ================= ADMIN ================= */
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import OrdersAdmin from "./pages/admin/AdminOrders";
import Coupons from "./pages/admin/Coupons";
import Deals from "./pages/admin/Deals";
import Analytics from "./pages/admin/Analytics";
import Payments from "./pages/admin/Payments";
import Returns from "./pages/admin/Returns";
import Refunds from "./pages/admin/Refunds";
import Settings from "./pages/admin/Settings";

/* ================= SELLER ================= */
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
import Compare from "./pages/buyer/Compare";

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

/* ================= COMMON ================= */
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import ProfilePage from "./components/common/ProfilePage";
import SettingsPage from "./components/common/SettingsPage";

export default function App() {
  return (
    <>
      <Routes>

        {/* ================= ADMIN ================= */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="deals" element={<Deals />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="payments" element={<Payments />} />
            <Route path="returns" element={<Returns />} />
            <Route path="refunds" element={<Refunds />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* ================= SELLER ================= */}
        <Route element={<ProtectedRoute allowedRoles={["SELLER"]} />}>
          <Route path="/seller" element={<SellerLayout />}>
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="orders" element={<SellerOrders />} />
          </Route>
        </Route>

        {/* ================= BUYER PUBLIC ================= */}
        <Route element={<BuyerLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="category/:category" element={<CategoryPage />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="compare" element={<Compare />} />
        </Route>

        {/* ================= BUYER PROTECTED ================= */}
        <Route element={<ProtectedRoute allowedRoles={["BUYER","SELLER","ADMIN"]} />}>
          <Route element={<BuyerLayout />}>
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<BuyerOrders />} />
            <Route path="wishlist" element={<Wishlist />} />

            <Route path="checkout" element={<Checkout />}>
              <Route index element={<Navigate to="address" />} />
              <Route path="address" element={<CheckoutAddress />} />
              <Route path="summary" element={<CheckoutSummary />} />
              <Route path="payment" element={<CheckoutPayment />} />
            </Route>

            <Route path="order-success" element={<OrderSuccess />} />
          </Route>
        </Route>

        {/* ================= PROFILE ================= */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= COMMON ================= */}
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />

      </Routes>

      <CompareBar />
    </>
  );
}
