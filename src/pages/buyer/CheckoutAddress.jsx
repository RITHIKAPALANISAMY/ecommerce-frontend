import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Trash2,
  PlusCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAmountRaw = localStorage.getItem("checkoutAmount");
        const storedItemsRaw = localStorage.getItem("checkoutItems");

        if (!storedAmountRaw || !storedItemsRaw) {
          navigate("/cart");
          return;
        }

        const storedAmount = JSON.parse(storedAmountRaw);
        const storedItems = JSON.parse(storedItemsRaw);

        if (!storedItems.length) {
          navigate("/cart");
          return;
        }

        setAmountData(storedAmount);

        const res = await api.get("/user/address");
        setAddresses(res.data || []);

        if (res.data?.length > 0) {
          setSelectedId(res.data[0].id);
        }
      } catch {
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleAddressAdded = (newAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedId(newAddress.id);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/user/address/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch {
      alert("Delete failed");
    }
  };

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
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <CheckoutSteps currentStep={1} />

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mt-8">

        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-white p-8 rounded-2xl shadow-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapPin size={18} className="text-red-600" />
              Select Delivery Address
            </h2>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg 
                         border border-red-600 text-red-600 text-sm
                         hover:bg-red-600 hover:text-white transition"
            >
              <PlusCircle size={14} />
              Add Address
            </button>
          </div>

          {showForm && (
            <AddressForm
              onSuccess={handleAddressAdded}
              onCancel={() => setShowForm(false)}
            />
          )}

          {addresses.length === 0 && (
            <p className="text-gray-500 text-sm">
              No addresses found. Please add one.
            </p>
          )}

          {/* ADDRESS CARDS */}
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedId(addr.id)}
              className={`relative p-5 rounded-xl mb-4 cursor-pointer border transition
                ${
                  selectedId === addr.id
                    ? "border-red-600 bg-red-50"
                    : "border-gray-200 hover:border-red-400"
                }`}
            >
              {selectedId === addr.id && (
                <CheckCircle2
                  size={18}
                  className="absolute top-4 right-4 text-red-600"
                />
              )}

              <p className="font-medium text-gray-800 text-base">
  {addr.street}
</p>

<p className="text-sm text-gray-600 mt-1">
  {addr.city}, {addr.state}
</p>

<p className="text-sm text-gray-600">
  {addr.pincode}
</p>

{/* ✅ PHONE NUMBER */}
<p className="text-sm text-gray-700 font-medium mt-1">
  📞 {addr.phoneNumber}
</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(addr.id);
                }}
                className="absolute bottom-4 right-4 text-gray-400 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </motion.div>
          ))}

          <button
            disabled={!selectedId}
            onClick={handleContinue}
            className="mt-6 w-full py-3 rounded-xl bg-red-600 
                       text-white font-medium text-sm
                       hover:bg-red-700 disabled:opacity-50 transition"
          >
            Continue to Order Summary →
          </button>
        </motion.div>

        {/* RIGHT PRICE CARD */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-md h-fit"
        >
          <h3 className="font-semibold text-base mb-6 flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-600" />
            Price Details
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{Number(amountData.subtotal).toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{Number(
  amountData.shipping ||
  amountData.delivery
).toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>GST</span>
              <span>₹{Number(amountData.gst).toFixed(2)}</span>
            </div>

            {amountData.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{Number(amountData.discount).toFixed(2)}</span>
              </div>
            )}
          </div>

          <hr className="my-6" />

          <div className="flex justify-between text-lg font-bold text-red-600">
            <span>Total</span>
            <span>₹{Number(amountData.total).toFixed(2)}</span>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Secure checkout • SSL encrypted
          </p>
        </motion.div>
      </div>
    </div>
  );
}