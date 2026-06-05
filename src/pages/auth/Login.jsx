import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import api from "../../api/axios";

export default function Login() {
  const { login, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");

  /* =====================================
      VALIDATIONS
  ===================================== */

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    // Minimum 8 chars
    return password.length >= 4;
  };

  /* =====================================
      NORMAL LOGIN
  ===================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // EMPTY VALIDATION
    if (!form.email.trim() || !form.password.trim()) {
      setError("All fields are required");
      return;
    }

    // EMAIL VALIDATION
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // PASSWORD VALIDATION
    if (!validatePassword(form.password)) {
      setError("Password must contain at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const result = await login({
        email: form.email.trim(),
        password: form.password,
      });

      if (result.success) {

  // Save seller email
  localStorage.setItem(
    "sellerEmail",
    form.email.trim()
  );

  navigate("/", { replace: true });

} else {

  setError(result.message || "Invalid email or password");

}

    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
      GOOGLE LOGIN
  ===================================== */

  const handleGoogleLogin = async () => {
    setError("");

    try {
      setGoogleLoading(true);

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      const idToken = await result.user.getIdToken();

      const response = await api.post("/auth/google", {
        idToken,
      });

      const { accessToken, refreshToken } = response.data;

      // STORE TOKENS
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // LOAD USER
      await fetchUserProfile();

      navigate("/", { replace: true });

    } catch (err) {
      console.error(err);

      setError("Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 px-6">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center p-12 bg-gradient-to-br from-red-400 to-red-500 text-white">

          <h1 className="text-4xl font-bold mb-6">
            Welcome to <br /> ShopVerse
          </h1>

          <p className="text-sm opacity-90 mb-8">
            Discover products, track orders and enjoy
            a seamless shopping experience.
          </p>

          <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl text-sm">
            🛍 Smart Shopping Platform
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-12 flex flex-col justify-center">

          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Login
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            Please sign in to continue
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-4 bg-red-100 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full px-5 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full px-5 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-3 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-red-500 hover:text-red-600 hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                loading
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-gray-200"></div>

              <span className="text-xs text-gray-400">
                Or continue with
              </span>

              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* GOOGLE LOGIN */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition"
            >

              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />

              <span className="text-sm font-medium text-gray-700">
                {googleLoading
                  ? "Signing in..."
                  : "Continue with Google"}
              </span>
            </button>

          </form>

          {/* SIGNUP */}
          <p className="mt-6 text-center text-sm text-gray-500">

            Don’t have an account?{" "}

            <Link
              to="/signup"
              className="text-red-500 font-medium hover:underline"
            >
              Signup
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}