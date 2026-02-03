import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const success = signup({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    });

    if (!success) {
      setError("Account already exists with this email");
      setLoading(false);
      return;
    }

    login(form.email, form.password);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-lg grid grid-cols-1 md:grid-cols-2">
        
        <div className="hidden md:flex flex-col justify-center bg-red-600 p-10 text-white">
          <h1 className="text-3xl font-bold mb-3">
            Create your ShopVerse account
          </h1>
          <p className="text-sm leading-relaxed">
            Join millions of shoppers and enjoy a seamless
            shopping experience.
          </p>
        </div>

      
        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            Sign Up
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create an account to get started
          </p>

          {error && (
            <div className="mt-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-600 py-2 text-white font-medium hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
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
