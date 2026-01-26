import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../styles/auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);

    const loggedUser = login(email.trim(), password);

    if (!loggedUser) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    /* 🔀 REDIRECT LOGIC (FINAL & CORRECT) */
    if (loggedUser.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      // 🔥 EVERYONE ELSE ENTERS BUYER PAGE
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <h1>Welcome to ShopVerse</h1>
          <p>
            Login to shop, place orders, or manage your seller account.
          </p>
        </div>

        <div className="auth-right">
          <h2>Login</h2>
          <p className="subtitle">Access your ShopVerse account</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <p className="signup-text">
              <Link to="/forgot-password">Forgot password?</Link>
            </p>

            <button className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
