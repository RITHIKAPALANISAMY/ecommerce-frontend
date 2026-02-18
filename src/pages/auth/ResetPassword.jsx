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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600 font-medium text-lg">
          Invalid or expired reset link
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-lg grid grid-cols-1 md:grid-cols-2">

        {/* Left Branding Panel */}
        <div className="hidden md:flex flex-col justify-center bg-red-600 p-10 text-white">
          <h1 className="text-3xl font-bold mb-3">
            Create New Password
          </h1>
          <p className="text-sm leading-relaxed">
            Choose a strong password to keep your account secure.
          </p>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            Reset Password
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter your new password below.
          </p>

          {error && (
            <div className="mt-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded bg-green-100 px-3 py-2 text-sm text-green-700">
              ✅ Password reset successful! Redirecting to login...
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">

              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-red-600 py-2 text-white font-medium hover:bg-red-700 disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Back to{" "}
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
