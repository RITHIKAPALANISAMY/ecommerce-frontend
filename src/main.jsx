import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

/* ================= CONTEXT PROVIDERS ================= */
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";
import { WishlistProvider } from "./context/WishlistContext";
import { UserProvider } from "./context/UserContext";
import { CompareProvider } from "./context/CompareContext";

import "./index.css";

/* ================= VERSION CONTROL ================= */
const APP_VERSION = "1.0.4"; // 🔥 increment version
const storedVersion = localStorage.getItem("app_version");

if (storedVersion !== APP_VERSION) {
  console.log("🔄 App updated to version:", APP_VERSION);

  // Optional: clear stale checkout cache on version change
  localStorage.removeItem("checkoutItems");
  localStorage.removeItem("checkoutAmount");
  localStorage.removeItem("checkoutAddress");
  localStorage.removeItem("paymentMethod");

  localStorage.setItem("app_version", APP_VERSION);
}

/* ================= RENDER APP ================= */
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <UserProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <WishlistProvider>
                <CompareProvider>
                  <App />
                </CompareProvider>
              </WishlistProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
);