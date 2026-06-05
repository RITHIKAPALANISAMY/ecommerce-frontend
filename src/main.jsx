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
const APP_VERSION = "1.0.5"; // 🔥 incremented
const storedVersion = localStorage.getItem("app_version");

if (storedVersion !== APP_VERSION) {
  console.log("🔄 ShopVerse updated to version:", APP_VERSION);

  // Clear only checkout-related stale data
  const keysToRemove = [
    "checkoutItems",
    "checkoutAmount",
    "checkoutAddress",
    "paymentMethod",
    "checkoutAddressId"
  ];

  keysToRemove.forEach((key) => localStorage.removeItem(key));

  localStorage.setItem("app_version", APP_VERSION);
}

/* ================= RENDER APP ================= */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
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
  </React.StrictMode>
);