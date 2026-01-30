import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      navigate("/forgot-password", { replace: true });
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
      navigate("/login", { replace: true });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-lg grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center bg-red-600 p-10 text-white">
          <h1 className="text-3xl font-bold mb-3">
            Create New Password
          </h1>
          <p className="text-sm leading-relaxed">
            Your new password must be strong and secure.
            Make sure you remember it.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            Set New Password
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose a strong password
          </p>

          {error && (
            <div className="mt-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded bg-green-100 px-3 py-2 text-sm text-green-700">
              ✅ Password reset successful. Redirecting to login…
            </div>
          )}

          {!success && (
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
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
                className="w-full rounded-lg bg-red-600 py-2 text-white font-medium hover:bg-red-700"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
