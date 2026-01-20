import { Routes, Route, Navigate } from "react-router-dom";

/* LAYOUTS */
import BuyerLayout from "./layouts/BuyerLayout";
import SellerLayout from "./layouts/SellerLayout";


/* ROUTE GUARDS */
import SellerRoutes from "./routes/SellerRoutes";

/* BUYER PAGES */
import Home from "./pages/buyer/Home";
import ProductDetails from "./pages/buyer/ProductDetails";
import Cart from "./pages/buyer/Cart";
import Orders from "./pages/buyer/Orders";
import OrderSuccess from "./pages/buyer/OrderSuccess";
import CategoryPage from "./pages/buyer/CategoryPage";
import SearchResults from "./pages/buyer/SearchResults";

/* CHECKOUT FLOW */
import Checkout from "./pages/buyer/Checkout";
import CheckoutAddress from "./pages/buyer/CheckoutAddress";
import CheckoutSummary from "./pages/buyer/CheckoutSummary";
import CheckoutPayment from "./pages/buyer/CheckoutPayment";

/* SELLER PAGES */
import SellerDashboard from "./pages/seller/SellerDashboard";

/* AUTH */
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

/* COMMON */
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import BecomeSeller from "./pages/seller/BecomeSeller";
import SellerOrders from "./pages/seller/SellerOrders";

export default function App() {
  return (
    <Routes>

      {/* ================= SELLER ROUTES ================= */}
      <Route element={<SellerRoutes />}>
        <Route element={<SellerLayout />}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
        </Route>
      </Route>

      {/* ================= BUYER ROUTES ================= */}
      <Route element={<BuyerLayout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="category/:category" element={<CategoryPage />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="cart" element={<Cart />} />

        {/* CHECKOUT */}
        <Route path="checkout" element={<Checkout />}>
          <Route index element={<Navigate to="address" replace />} />
          <Route path="address" element={<CheckoutAddress />} />
          <Route path="summary" element={<CheckoutSummary />} />
          <Route path="payment" element={<CheckoutPayment />} />
        </Route>

        {/* ORDER SUCCESS */}
        <Route path="order-success" element={<OrderSuccess />} />

        <Route path="orders" element={<Orders />} />
      </Route>

      {/* ================= AUTH ROUTES ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ================= COMMON ================= */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/become-seller" element={<BecomeSeller />} />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}
