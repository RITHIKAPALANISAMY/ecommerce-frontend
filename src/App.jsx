import { Routes, Route, Navigate } from "react-router-dom";

import BuyerLayout from "./layouts/BuyerLayout";

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

/* AUTH */
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

export default function App() {
  return (
    <Routes>
      {/* BUYER LAYOUT */}
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

        {/* ✅ ORDER SUCCESS (NOT INSIDE CHECKOUT) */}
        <Route path="order-success" element={<OrderSuccess />} />


        <Route path="orders" element={<Orders />} />
      </Route>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
