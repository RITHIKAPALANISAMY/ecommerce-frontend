import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";

import BuyerLayout from "../layouts/BuyerLayout";

import Home from "../pages/buyer/Home";
import ProductList from "../pages/buyer/ProductList";
import ProductDetails from "../pages/buyer/ProductDetails";
import Cart from "../pages/buyer/Cart";
import Checkout from "../pages/buyer/Checkout";
import Orders from "../pages/buyer/Orders";
import OrderSuccess from "../pages/buyer/OrderSuccess";

export default function BuyerRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC BUYER ROUTES ================= */}
      <Route element={<BuyerLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetails />} />
      </Route>

      {/* ================= PROTECTED BUYER ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={["BUYER"]} />}>

        {/* ALL protected pages MUST be inside BuyerLayout */}
        <Route element={<BuyerLayout />}>

          <Route path="cart" element={<Cart />} />
          <Route path="checkout/*" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />

          {/* ✅ FIXED: order-success INSIDE layout */}
          <Route path="order-success" element={<OrderSuccess />} />

        </Route>

      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}