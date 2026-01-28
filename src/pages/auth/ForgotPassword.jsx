import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/auth.css";

export default function ForgotPassword() {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    const exists = verifyEmail(email);

    if (!exists) {
      setError("No account found with this email");
      return;
    }

    // ✅ Save email for reset page
    localStorage.setItem("resetEmail", email);

    // ✅ GO TO RESET PASSWORD PAGE
    navigate("/reset-password");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <h1>Forgot Password?</h1>
          <p>Enter your registered email and we’ll help you reset your password.</p>
        </div>

        <div className="auth-right">
          <h2>Reset your password</h2>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="btn-primary">
              Continue
            </button>
          </form>

          <p className="signup-text">
            Remembered your password? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
