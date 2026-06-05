import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith("/checkout")) return;

    // Must be logged in
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Must be buyer
    const isBuyer =
      user.roles?.includes("BUYER") ||
      user.roles?.includes("buyer");

    if (!isBuyer) {
      navigate("/", { replace: true });
      return;
    }

  }, [user, location.pathname, navigate]);

  return <Outlet />;
}