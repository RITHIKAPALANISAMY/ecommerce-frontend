import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ✅ READ EMAIL FROM LOCALSTORAGE */
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");

    if (!storedEmail) {
      navigate("/forgot-password");
      return;
    }

    setEmail(storedEmail);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirm) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    resetPassword(email, password);

    /* ✅ CLEAN UP */
    localStorage.removeItem("resetEmail");

    setSuccess(true);

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <h1>Create new password</h1>
          <p>Your new password must be strong and secure.</p>
        </div>

        <div className="auth-right">
          <h2>Set new password</h2>

          {error && <p className="error">{error}</p>}
          {success && (
            <p className="success">
              Password reset successful. Redirecting to login…
            </p>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              <button className="btn-primary">
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
