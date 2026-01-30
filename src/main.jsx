import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

/* ===== CONTEXT PROVIDERS ===== */
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SellerProductProvider } from "./context/SellerProductContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";
import { WishlistProvider } from "./context/WishlistContext";

/* ===== GLOBAL STYLES ===== */
import "./index.css";
import "./styles/global.css";

/* ================= APP VERSION CONTROL ================= */
/* 🔥 VERSION BUMP TO CLEAR OLD / HARDCODED DATA */
const APP_VERSION = "1.0.1"; // updated from 1.0.0

const storedVersion = localStorage.getItem("app_version");

if (storedVersion !== APP_VERSION) {
  console.log("🔄 App updated → clearing old cache");
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("app_version", APP_VERSION);
}
/* ======================================================= */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SellerProductProvider>
            <ProductProvider>
              <OrderProvider>
                <WishlistProvider>
                  <App />
                </WishlistProvider>
              </OrderProvider>
            </ProductProvider>
          </SellerProductProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
