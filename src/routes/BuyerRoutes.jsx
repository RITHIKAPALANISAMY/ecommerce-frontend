import { Routes, Route } from "react-router-dom";
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
      <Route element={<BuyerLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders" element={<Orders />} />
        <Route path="order-success" element={<OrderSuccess />} />
      </Route>
    </Routes>
  );
}
