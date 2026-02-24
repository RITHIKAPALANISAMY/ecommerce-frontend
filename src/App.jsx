import { Routes, Route, Navigate } from "react-router-dom";
import CompareBar from "./components/common/CompareBar";
import "./index.css";

/* ROUTE GUARD */
import ProtectedRoute from "./routes/ProtectedRoute";

/* LAYOUTS */
import AdminLayout from "./layouts/AdminLayout";
import SellerLayout from "./layouts/SellerLayout";
import BuyerLayout from "./layouts/BuyerLayout";

/* ADMIN */
import Coupons from "./pages/admin/Coupons";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import OrdersAdmin from "./pages/admin/AdminOrders";
import AdminSellerRequests from "./pages/admin/AdminSellerRequests";

/* SELLER */
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerReviews from "./pages/seller/SellerReviews";
import BecomeSeller from "./pages/seller/BecomeSeller";

/* BUYER */
import Home from "./pages/buyer/Home";
import ProductDetails from "./pages/buyer/ProductDetails";
import CategoryPage from "./pages/buyer/CategoryPage";
import SearchResults from "./pages/buyer/SearchResults";
import Cart from "./pages/buyer/Cart";
import BuyerOrders from "./pages/buyer/Orders";
import Wishlist from "./pages/buyer/Wishlist";
import Compare from "./pages/buyer/Compare";

/* CHECKOUT */
import Checkout from "./pages/buyer/Checkout";
import CheckoutAddress from "./pages/buyer/CheckoutAddress";
import CheckoutSummary from "./pages/buyer/CheckoutSummary";
import CheckoutPayment from "./pages/buyer/CheckoutPayment";
import OrderSuccess from "./pages/buyer/OrderSuccess";

/* AUTH */
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

/* COMMON */
import Profile from "./pages/common/Profile";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

/* TOAST */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <Routes>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="seller-requests" element={<AdminSellerRequests />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["SELLER"]} />}>
          <Route path="/seller" element={<SellerLayout />}>
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="reviews" element={<SellerReviews />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["BUYER"]} />}>
          <Route path="/become-seller" element={<BecomeSeller />} />
        </Route>

        <Route element={<BuyerLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="category/:category" element={<CategoryPage />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="compare" element={<Compare />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["BUYER"]} />}>
          <Route element={<BuyerLayout />}>
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<BuyerOrders />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="profile" element={<Profile />} />
            <Route path="checkout" element={<Checkout />}>
              <Route index element={<Navigate to="address" />} />
              <Route path="address" element={<CheckoutAddress />} />
              <Route path="summary" element={<CheckoutSummary />} />
              <Route path="payment" element={<CheckoutPayment />} />
            </Route>
            <Route path="order-success" element={<OrderSuccess />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />

      </Routes>

      <CompareBar />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        pauseOnHover
      />
    </>
  );
}