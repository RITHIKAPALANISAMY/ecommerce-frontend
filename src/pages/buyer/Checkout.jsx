import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only guard /checkout routes
    if (!location.pathname.startsWith("/checkout")) return;

    // Must be logged in
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Must be buyer
    const isBuyer = user.roles?.includes("buyer");

    if (!isBuyer) {
      navigate("/", { replace: true });
      return;
    }

    // ❗ Important Fix:
    // Allow empty cart ONLY during payment step
    if (
      cartItems.length === 0 &&
      location.pathname !== "/checkout/payment"
    ) {
      navigate("/cart", { replace: true });
    }

  }, [user, cartItems, location.pathname, navigate]);

  return <Outlet />;
}