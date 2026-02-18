import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

/* ================= CONTEXT PROVIDERS ================= */
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SellerProductProvider } from "./context/SellerProductContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";
import { WishlistProvider } from "./context/WishlistContext";
import { UserProvider } from "./context/UserContext";
import { CompareProvider } from "./context/CompareContext";

import "./index.css";

/* ================= VERSION CONTROL ================= */
const APP_VERSION = "1.0.2";
const storedVersion = localStorage.getItem("app_version");

/*
  🔹 We do NOT clear localStorage
  🔹 Only update version key safely
*/
if (storedVersion !== APP_VERSION) {
  console.log("🔄 App updated to version:", APP_VERSION);
  localStorage.setItem("app_version", APP_VERSION);
}

/* ================= RENDER APP ================= */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SellerProductProvider>
            <ProductProvider>
              <OrderProvider>
                <WishlistProvider>
                  <UserProvider>
                    <CompareProvider>
                      <App />
                    </CompareProvider>
                  </UserProvider>
                </WishlistProvider>
              </OrderProvider>
            </ProductProvider>
          </SellerProductProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
