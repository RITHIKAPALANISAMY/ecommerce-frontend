import "../../styles/checkoutAddress.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CheckoutSteps from "./CheckoutSteps";

export default function CheckoutAddress() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      phone: "+91 98765 43210",
      address: "123, Green Park, Near City Mall",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true
    }
  ]);

  const [selectedId, setSelectedId] = useState(1);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const delivery = 99;
  const gst = Math.round(subtotal * 0.18);
  const discount = 70;
  const total = subtotal + delivery + gst - discount;

  const handleSaveAddress = () => {
    if (!form.name || !form.phone || !form.address) return;

    const newAddress = {
      id: Date.now(),
      ...form,
      isDefault: false
    };

    setAddresses(prev => [...prev, newAddress]);
    setSelectedId(newAddress.id);
    setShowForm(false);

    setForm({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: ""
    });
  };

  return (
    <div className="checkout-wrapper">

      {/* ✅ SINGLE SOURCE OF TRUTH */}
      <CheckoutSteps currentStep={1} />

      <div className="checkout-grid">

        {/* LEFT */}
        <div className="address-card">

          <div className="address-header">
            <h2>Select Delivery Address</h2>
            <button
  className="add-address-btn"
  onClick={() => setShowForm(true)}
>
  + Add New Address
</button>

          </div>

          {showForm && (
            <div className="address-form">
              <input placeholder="Full Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />

              <input placeholder="Mobile Number" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />

              <input placeholder="Address" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })} />

              <input placeholder="City" value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })} />

              <input placeholder="State" value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })} />

              <input placeholder="Pincode" value={form.pincode}
                onChange={e => setForm({ ...form, pincode: e.target.value })} />

              <div className="form-actions">
                <button
  className="cancel-btn"
  onClick={() => setShowForm(false)}
>
  Cancel
</button>

                <button className="save-btn" onClick={handleSaveAddress}>
                  Save Address
                </button>
              </div>
            </div>
          )}

          {addresses.map(addr => (
            <div
              key={addr.id}
              className={`address-box ${selectedId === addr.id ? "active" : ""}`}
              onClick={() => setSelectedId(addr.id)}
            >
              <strong>{addr.name}</strong>
              {addr.isDefault && <span className="default">Default</span>}
              <p>{addr.phone}</p>
              <p>{addr.address}</p>
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
            </div>
          ))}

          <button
            className="continue-btn"
            disabled={!selectedId}
            onClick={() => {
  const selectedAddress = addresses.find(a => a.id === selectedId);
  localStorage.setItem(
    "checkoutAddress",
    JSON.stringify(selectedAddress)
  );
  navigate("/checkout/summary");
}}

          >
            Continue to Order Summary →
          </button>
        </div>

        {/* RIGHT */}
        <div className="price-card">
          <h3>Price Details</h3>

          <div className="price-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="price-row">
            <span>Delivery</span>
            <span>₹{delivery}</span>
          </div>

          <div className="price-row">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>

          <div className="price-row discount">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>

          <hr />

          <div className="price-total">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>

          <div className="saving">
            ✓ You will save ₹{discount} on this order!
          </div>
        </div>
      </div>
    </div>
  );
}
