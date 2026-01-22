import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    /* 🔐 NOT LOGGED IN */
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    /* 🔐 ADMIN → ADMIN DASHBOARD ONLY */
    if (user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    /* 🔐 SELLER → NO CHECKOUT ACCESS */
    if (user.role === "seller") {
      navigate("/", { replace: true });
      return;
    }

    /* 🔐 EMPTY CART → BACK TO CART */
    if (!cartItems || cartItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [user, cartItems, navigate]);

  return <Outlet />;
}
