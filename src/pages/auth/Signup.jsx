import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export default function Signup() {
  const { login } = useAuth(); // demo: auto-login after signup
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    login(email, password); // mock signup
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <h1>Join ShopVerse</h1>
          <p>Create an account to enjoy seamless shopping.</p>
        </div>

        <div className="auth-right">
          <h2>Create Account</h2>
          <p className="subtitle">It only takes a minute</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
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

            <button className="btn-primary">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}
