import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or expired reset link");
      return;
    }

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

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Reset link expired or invalid"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-gray-100">
        <p className="text-red-600 font-medium text-lg">
          Invalid or expired reset link
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 px-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE — SAME AS LOGIN */}
        <div className="flex flex-col justify-center p-12 bg-gradient-to-br from-red-400 to-red-500 text-white">
          <h1 className="text-4xl font-bold mb-6">
            Reset Your <br /> Password
          </h1>

          <p className="text-sm opacity-90 mb-8">
            Choose a strong password to keep your
            account secure and protected.
          </p>

          <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl text-sm">
            🔐 Secure Account Access
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-12 flex flex-col justify-center">

          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Reset Password
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            Enter your new password below
          </p>

          {error && (
            <div className="mb-4 bg-red-100 text-red-600 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 text-green-600 text-sm px-4 py-2 rounded-lg">
              Password reset successful! Redirecting...
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Back to{" "}
            <Link
              to="/login"
              className="text-red-500 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}