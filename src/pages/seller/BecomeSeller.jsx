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

    updateUserRole("seller", form);
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
            placeholder="Your Store Name"
            value={form.storeName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Owner Name</label>
          <input
            name="ownerName"
            placeholder="Owner Full Name"
            value={form.ownerName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email} disabled />
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            name="phone"
            placeholder="10-digit mobile number"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>GST Number (optional)</label>
          <input
            name="gst"
            placeholder="GSTIN"
            value={form.gst}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Business Address *</label>
          <textarea
            name="address"
            placeholder="Complete business address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn">
          Become a Seller
        </button>
      </form>
    </div>
  );
}
