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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    const success = login(email, password);

    if (success) navigate(from, { replace: true });
    else setError("Invalid credentials");
  };

  const socialAlert = () => {
    alert("Social login will be available soon.");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <h1>Welcome to ShopVerse</h1>
          <p>
            Shop smarter, faster, and better.  
            Login to manage your orders and checkout securely.
          </p>
        </div>

        <div className="auth-right">
          <h2>Welcome Back</h2>
          <p className="subtitle">Please login to your account</p>

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

            <button className="btn-primary">Login</button>
          </form>

          <div className="divider">or login with</div>

          <div className="social-login">
            <button onClick={socialAlert}>Google</button>
            <button onClick={socialAlert}>Facebook</button>
          </div>

          <p className="signup-text">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
