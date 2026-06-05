import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your registered email");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setMessage(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 px-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE — SAME AS RESET */}
        <div className="flex flex-col justify-center p-12 bg-gradient-to-br from-red-400 to-red-500 text-white">
          <h1 className="text-4xl font-bold mb-6">
            Forgot Your <br /> Password?
          </h1>

          <p className="text-sm opacity-90 mb-8">
            Enter your registered email and
            we’ll send you a secure reset link.
          </p>

          <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl text-sm">
            📧 Quick & Secure Recovery
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-12 flex flex-col justify-center">

          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Reset Password
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            We’ll email you a reset link
          </p>

          {error && (
            <div className="mb-4 bg-red-100 text-red-600 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 bg-green-100 text-green-600 text-sm px-4 py-2 rounded-lg">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

          </form>

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