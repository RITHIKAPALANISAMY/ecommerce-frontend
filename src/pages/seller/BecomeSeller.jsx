import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/seller/becomeSeller.css";

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

    // ✅ FIX: pass ONLY seller data object
    updateUserRole(form);

    navigate("/seller/dashboard");
  };

  return (
    <div className="become-seller-page">
      <form className="seller-form" onSubmit={handleSubmit}>
        <h2>Become a Seller</h2>
        <p className="subtitle">
          Start selling your products on <strong>ShopVerse</strong>
        </p>

        <div className="form-group">
          <label>Store Name *</label>
          <input
            name="storeName"
            value={form.storeName}
            onChange={handleChange}
            placeholder="Your Store Name"
          />
        </div>

        <div className="form-group">
          <label>Owner Name</label>
          <input
            name="ownerName"
            value={form.ownerName}
            onChange={handleChange}
            placeholder="Owner Full Name"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input value={form.email} disabled />
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
          />
        </div>

        <div className="form-group">
          <label>GST Number (optional)</label>
          <input
            name="gst"
            value={form.gst}
            onChange={handleChange}
            placeholder="GSTIN"
          />
        </div>

        <div className="form-group">
          <label>Business Address *</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Complete business address"
          />
        </div>

        <button type="submit" className="submit-btn">
          Become a Seller
        </button>
      </form>
    </div>
  );
}
