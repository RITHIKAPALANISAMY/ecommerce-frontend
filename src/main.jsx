import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SellerProductProvider } from "./context/SellerProductContext";
import "./styles/global.css";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SellerProductProvider>
            <ProductProvider>
              <OrderProvider>
                <App />
              </OrderProvider>
            </ProductProvider>
          </SellerProductProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
