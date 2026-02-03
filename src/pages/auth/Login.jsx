import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

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

    if (loggedUser.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-lg grid grid-cols-1 md:grid-cols-2">
        
    
        <div className="hidden md:flex flex-col justify-center bg-red-600 p-10 text-white">
          <h1 className="text-3xl font-bold mb-3">
            Welcome to ShopVerse
          </h1>
          <p className="text-sm leading-relaxed">
            Login to shop, place orders, or manage your account
            with ease.
          </p>
        </div>
        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            Login
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Access your ShopVerse account
          </p>

          {error && (
            <div className="mt-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-red-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-600 py-2 text-white font-medium hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-red-600 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
