import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function BecomeSeller() {
  const { user, updateUserRole } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    storeName: "",
    ownerName: "",
    email: user?.email || "",
    phone: "",
    gst: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.storeName || !form.phone || !form.address) {
      alert("Please fill all required fields");
      return;
    }

    updateUserRole(form);

    navigate("/seller/dashboard", { replace: true });
    console.log("Submit clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800">
          Become a Seller
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Start selling your products on{" "}
          <strong>ShopVerse</strong>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      
          <div>
            <label className="mb-1 block text-sm font-medium">
              Store Name <span className="text-red-600">*</span>
            </label>
            <input
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              placeholder="Your Store Name"
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

        
          <div>
            <label className="mb-1 block text-sm font-medium">
              Owner Name
            </label>
            <input
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              placeholder="Owner Full Name"
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

      
          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              value={form.email}
              disabled
              className="w-full cursor-not-allowed rounded-lg border bg-gray-100 px-4 py-2 text-sm"
            />
          </div>

    
          <div>
            <label className="mb-1 block text-sm font-medium">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

      
          <div>
            <label className="mb-1 block text-sm font-medium">
              GST Number (optional)
            </label>
            <input
              name="gst"
              value={form.gst}
              onChange={handleChange}
              placeholder="GSTIN"
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

      
          <div>
            <label className="mb-1 block text-sm font-medium">
              Business Address <span className="text-red-600">*</span>
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Complete business address"
              rows={3}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-red-600 py-2 text-white font-medium hover:bg-red-700"
          >
            Become a Seller
          </button>
        </form>
      </div>
    </div>
  );
}
