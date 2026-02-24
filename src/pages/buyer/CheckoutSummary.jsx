import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import CheckoutSteps from "./CheckoutSteps";

export default function CheckoutSummary() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD FROM BACKEND ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const addressId = localStorage.getItem("checkoutAddressId");

        // Must have selected address
        if (!addressId) {
          navigate("/checkout/address");
          return;
        }

        const [cartRes, summaryRes] = await Promise.all([
          api.get("/cart"),
          api.get("/cart/summary"),
        ]);

        if (!cartRes.data || cartRes.data.length === 0) {
          navigate("/cart");
          return;
        }

        setCartItems(cartRes.data);
        setSummary(summaryRes.data);

      } catch (err) {
        console.error("Summary load failed:", err);
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading order summary...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <CheckoutSteps currentStep={2} />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

        {/* ================= CART ITEMS ================= */}
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between mb-3 border-b pb-2"
          >
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>
              ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
            </span>
          </div>
        ))}

        {/* ================= PRICE DETAILS ================= */}
        {summary && (
          <div className="mt-6 border-t pt-4 space-y-2">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{summary.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{summary.delivery.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{summary.gst.toFixed(2)}</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{summary.total.toFixed(2)}</span>
            </div>

          </div>
        )}

        <button
          onClick={() => navigate("/checkout/payment")}
          className="mt-6 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
        >
          Proceed to Payment →
        </button>

      </div>
    </div>
  );
}