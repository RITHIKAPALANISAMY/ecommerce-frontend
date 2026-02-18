import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);

    const success = await login(form);

    setLoading(false);

    if (success) {
      navigate("/", { replace: true });
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE - BRAND SECTION */}
        <div className="hidden md:flex flex-col justify-center bg-red-600 p-10 text-white">
          <h1 className="text-4xl font-bold mb-4">
            Welcome Back to ShopVerse
          </h1>
          <p className="text-sm leading-relaxed opacity-90">
            Login to explore exclusive deals, track your orders,
            manage wishlist and enjoy seamless shopping.
          </p>

          <div className="mt-8 text-sm">
            New here?{" "}
            <Link
              to="/signup"
              className="underline font-semibold hover:text-gray-200"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE - LOGIN FORM */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Login to your account
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials below
          </p>

          {error && (
            <div className="mb-4 bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

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
              className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Mobile Signup Link */}
          <div className="mt-6 text-center text-sm text-gray-600 md:hidden">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-red-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
