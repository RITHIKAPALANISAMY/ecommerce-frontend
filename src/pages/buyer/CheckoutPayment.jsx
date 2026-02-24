import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import paymentApi from "../../api/paymentApi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import CheckoutSteps from "./CheckoutSteps";
import { CreditCard, Wallet, Banknote } from "lucide-react";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();

  const [method, setMethod] = useState("CARD");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  /* ================= LOAD SUMMARY ================= */
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const res = await api.get("/cart/summary");
        setSummary(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    if (!summary) return;

    try {
      setPlacingOrder(true);
      setError("");

      /* ===== COD ===== */
      if (method === "COD") {
        const verifyRes = await paymentApi.post("/payment/verify", {
          razorpayOrderId: "COD_ORDER",
          razorpayPaymentId: "COD_PAYMENT",
          razorpaySignature: "COD_SIGNATURE",
          userEmail: user.email,
          amount: summary.total,
          paymentMethod: "COD",
        });

        clearCart();

        navigate("/order-success", {
          state: { order: verifyRes.data }, // ✅ FIXED
        });

        return;
      }

      /* ===== CREATE RAZORPAY ORDER ===== */
      const res = await paymentApi.post("/payment/create-order", {
        amount: summary.total,
      });

      const { orderId, amount, key } = res.data;

      if (!key) {
        setError("Backend did not send Razorpay key.");
        return;
      }

      if (!window.Razorpay) {
        setError("Razorpay SDK not loaded.");
        return;
      }

      const options = {
        key: key,
        amount: amount,
        currency: "INR",
        name: "ShopVerse",
        description: "Order Payment",
        order_id: orderId,

        handler: async function (response) {
          try {
            const verifyRes = await paymentApi.post("/payment/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              userEmail: user.email,
              amount: summary.total,
              paymentMethod: method,
            });

            clearCart();

            navigate("/order-success", {
              state: { order: verifyRes.data }, // ✅ FIXED
            });

          } catch (err) {
            console.error(err);
            setError("Payment verification failed.");
          }
        },

        modal: {
          ondismiss: function () {
            setError("Payment popup closed.");
          },
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#ef4444",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      setError("Payment failed.");
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading payment...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4">
      <CheckoutSteps currentStep={3} />

      <div className="mx-auto mt-4 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Payment Options</h2>

          {error && (
            <div className="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {[
            ["CARD", <CreditCard size={18} />, "Card / UPI"],
            ["WALLET", <Wallet size={18} />, "Wallet"],
            ["COD", <Banknote size={18} />, "Cash on Delivery"],
          ].map(([keyName, icon, label]) => (
            <div
              key={keyName}
              onClick={() => setMethod(keyName)}
              className={`mb-2 flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 ${
                method === keyName
                  ? "border-red-600 bg-red-50"
                  : "hover:bg-gray-50"
              }`}
            >
              {icon}
              {label}
            </div>
          ))}

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => navigate("/checkout/summary")}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
            >
              Back
            </button>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="rounded-lg bg-red-600 px-6 py-2 text-sm text-white"
            >
              {placingOrder ? "Processing..." : "Place Order →"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">Price Details</h3>

          {summary && (
            <>
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{Number(summary.subtotal).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>GST</span>
                <span>₹{Number(summary.gst).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span>₹{Number(summary.delivery).toFixed(2)}</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{Number(summary.total).toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}