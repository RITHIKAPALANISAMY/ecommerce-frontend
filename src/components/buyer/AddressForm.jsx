import { useState } from "react";
import { MapPin, Home, Building, Hash } from "lucide-react";
import api from "../../api/axios";

export default function AddressForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!form.street || !form.city || !form.state || !form.pincode) {
      setError("All fields are required");
      return false;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Pincode must be 6 digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/user/address", form);

      if (onSuccess) {
        onSuccess(res.data);
      }

      setForm({
        street: "",
        city: "",
        state: "",
        pincode: ""
      });

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save address"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">

      <div className="flex items-center gap-2 mb-5">
        <MapPin className="text-red-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">
          Add New Address
        </h3>
      </div>

      <div className="space-y-4">

        {/* Street */}
        <div className="relative">
          <Home className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Street Address"
            value={form.street}
            onChange={(e) => handleChange("street", e.target.value)}
            className="w-full rounded-lg border pl-10 pr-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        {/* City */}
        <div className="relative">
          <Building className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="w-full rounded-lg border pl-10 pr-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        {/* State */}
        <div className="relative">
          <Building className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="State"
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
            className="w-full rounded-lg border pl-10 pr-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        {/* Pincode */}
        <div className="relative">
          <Hash className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => handleChange("pincode", e.target.value)}
            className="w-full rounded-lg border pl-10 pr-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3 pt-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border py-2 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-lg bg-red-600 text-white py-2 hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </div>

      </div>
    </div>
  );
}