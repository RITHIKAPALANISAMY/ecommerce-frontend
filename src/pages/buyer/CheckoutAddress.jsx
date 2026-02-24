import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Trash2, PlusCircle } from "lucide-react";
import api from "../../api/axios";
import CheckoutSteps from "./CheckoutSteps";
import AddressForm from "../../components/buyer/AddressForm";

export default function CheckoutAddress() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [amountData, setAmountData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAmount = JSON.parse(localStorage.getItem("checkoutAmount"));
        const storedItems = JSON.parse(localStorage.getItem("checkoutItems"));

        if (!storedAmount || !storedItems) {
          navigate("/cart");
          return;
        }

        setAmountData(storedAmount);

        const res = await api.get("/user/address");
        setAddresses(res.data);

        if (res.data.length > 0) {
          setSelectedId(res.data[0].id);
        }

      } catch (err) {
        console.error("Address load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  /* ================= ADD SUCCESS ================= */
  const handleAddressAdded = (newAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedId(newAddress.id);
    setShowForm(false);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await api.delete(`/user/address/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));

      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= CONTINUE ================= */
  const handleContinue = () => {
    if (!selectedId) return;

    localStorage.setItem("checkoutAddressId", selectedId);
    navigate("/checkout/summary");
  };

  if (loading || !amountData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading address...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <CheckoutSteps currentStep={1} />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 mt-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapPin size={18} /> Select Delivery Address
            </h2>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 text-sm border px-3 py-2 rounded-lg text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition"
            >
              <PlusCircle size={16} />
              Add Address
            </button>
          </div>

          {/* ADDRESS FORM */}
          {showForm && (
            <AddressForm
              onSuccess={handleAddressAdded}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* ADDRESS LIST */}
          {addresses.length === 0 && (
            <p className="text-gray-500 text-sm">
              No addresses found. Please add one.
            </p>
          )}

          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => setSelectedId(addr.id)}
              className={`p-4 border rounded-xl mb-4 cursor-pointer transition ${
                selectedId === addr.id
                  ? "border-red-600 bg-red-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{addr.street}</p>
                  <p className="text-sm text-gray-600">
                    {addr.city}, {addr.state}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.pincode}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(addr.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <button
            disabled={!selectedId}
            onClick={handleContinue}
            className="mt-4 w-full bg-red-600 text-white py-3 rounded-xl disabled:opacity-50"
          >
            Continue to Order Summary →
          </button>
        </div>

        {/* RIGHT SIDE PRICE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-4">Price Details</h3>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{Number(amountData.subtotal).toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>₹{Number(amountData.shipping).toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>GST</span>
            <span>₹{Number(amountData.gst).toFixed(2)}</span>
          </div>

          {amountData.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{Number(amountData.discount).toFixed(2)}</span>
            </div>
          )}

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{Number(amountData.total).toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}