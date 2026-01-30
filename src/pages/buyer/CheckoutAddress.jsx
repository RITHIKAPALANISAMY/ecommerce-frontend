import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CheckoutSteps from "./CheckoutSteps";

export default function CheckoutAddress() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* 🔹 LOAD ADDRESSES FROM LOCAL STORAGE */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("addresses")) || [];
    setAddresses(stored);

    const defaultAddr = stored.find(a => a.isDefault);
    if (defaultAddr) setSelectedId(defaultAddr.id);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const delivery = 99;
  const gst = Math.round(subtotal * 0.18);
  const discount = 70;
  const total = subtotal + delivery + gst - discount;

  /* 🔹 SAVE ADDRESS */
  const handleSaveAddress = () => {
    if (!form.name || !form.phone || !form.address) return;

    const newAddress = {
      id: Date.now(),
      ...form,
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, newAddress];
    setAddresses(updated);
    setSelectedId(newAddress.id);

    localStorage.setItem("addresses", JSON.stringify(updated));

    setForm({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

    setShowForm(false);
  };

  /* 🔹 CONTINUE */
  const handleContinue = () => {
    const selectedAddress = addresses.find(a => a.id === selectedId);
    localStorage.setItem(
      "checkoutAddress",
      JSON.stringify(selectedAddress)
    );
    navigate("/checkout/summary");
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-6">
      <CheckoutSteps currentStep={1} />

      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">

        {/* LEFT */}
        <div className="md:col-span-2 rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Select Delivery Address
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
            >
              + Add New Address
            </button>
          </div>

          {/* ADD FORM */}
          {showForm && (
            <div className="mb-6 grid grid-cols-1 gap-3 rounded-lg border p-4">
              {["name","phone","address","city","state","pincode"].map((f) => (
                <input
                  key={f}
                  placeholder={f.toUpperCase()}
                  value={form[f]}
                  onChange={(e) =>
                    setForm({ ...form, [f]: e.target.value })
                  }
                  className="rounded border px-3 py-2 text-sm"
                />
              ))}

              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAddress}
                  className="rounded bg-red-600 px-4 py-2 text-sm text-white"
                >
                  Save Address
                </button>
              </div>
            </div>
          )}

          {/* ADDRESS LIST */}
          {addresses.map(addr => (
            <div
              key={addr.id}
              onClick={() => setSelectedId(addr.id)}
              className={`mb-3 cursor-pointer rounded-lg border p-4 transition ${
                selectedId === addr.id
                  ? "border-red-600 bg-red-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <strong>{addr.name}</strong>
                {addr.isDefault && (
                  <span className="rounded bg-green-600 px-2 py-0.5 text-xs text-white">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm">{addr.phone}</p>
              <p className="text-sm">{addr.address}</p>
              <p className="text-sm">
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </div>
          ))}

          <button
            disabled={!selectedId}
            onClick={handleContinue}
            className="mt-4 w-full rounded bg-red-600 py-2 text-white disabled:opacity-50"
          >
            Continue to Order Summary →
          </button>
        </div>

        {/* RIGHT */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">
            Price Details
          </h3>

          {[
            ["Subtotal", subtotal],
            ["Delivery", delivery],
            ["GST (18%)", gst],
            ["Discount", -discount],
          ].map(([l, v]) => (
            <div key={l} className="mb-2 flex justify-between text-sm">
              <span>{l}</span>
              <span>₹{v}</span>
            </div>
          ))}

          <hr className="my-3" />

          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>

          <p className="mt-2 text-sm text-green-600">
            ✓ You will save ₹{discount} on this order!
          </p>
        </div>
      </div>
    </div>
  );
}
