import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    const success = signup(
      name.trim(),
      email.trim(),
      password
    );

    if (!success) {
      setError("Account already exists");
      setLoading(false);
      return;
    }

    
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-lg grid grid-cols-1 md:grid-cols-2">
        
        
        <div className="hidden md:flex flex-col justify-center bg-red-600 p-10 text-white">
          <h1 className="text-3xl font-bold mb-3">
            Join ShopVerse
          </h1>
          <p className="text-sm leading-relaxed">
            Create your account to start shopping, managing
            orders, and enjoying exclusive deals.
          </p>
        </div>

        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Account
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Sign up to get started
          </p>

          {error && (
            <div className="mt-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-600 py-2 text-white font-medium hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-red-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
