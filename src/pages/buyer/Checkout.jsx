import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [user, cartItems, navigate]);

  return <Outlet />;
}
