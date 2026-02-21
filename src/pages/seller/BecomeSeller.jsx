import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function BecomeSeller() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    storeName: "",
    phone: "",
    gstNumber: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.storeName || !form.phone || !form.address) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/seller/request", form);

      alert("Seller request submitted successfully!");
      navigate("/", { replace: true });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to submit seller request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800">
          Become a Seller
        </h2>

        {error && (
          <div className="mt-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <input
            name="storeName"
            placeholder="Store Name"
            value={form.storeName}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            name="gstNumber"
            placeholder="GST Number (optional)"
            value={form.gstNumber}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <textarea
            name="address"
            placeholder="Business Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
