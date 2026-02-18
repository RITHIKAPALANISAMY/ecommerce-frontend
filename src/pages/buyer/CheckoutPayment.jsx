import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CheckoutSteps from "./CheckoutSteps";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import paymentApi from "../../api/paymentApi";
import { CreditCard, Wallet, Banknote } from "lucide-react";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();

  const [method, setMethod] = useState("card");
  const [error, setError] = useState("");

  const checkoutAmount = JSON.parse(localStorage.getItem("checkoutAmount"));
  const checkoutAddress = JSON.parse(localStorage.getItem("checkoutAddress"));
  const checkoutItems =
    JSON.parse(localStorage.getItem("checkoutItems")) || [];

  const handlePlaceOrder = async () => {
    if (!checkoutItems.length) {
      setError("No items to place order");
      return;
    }

    /* ================= COD ================= */
    if (method === "cod") {
      const existingOrders =
        JSON.parse(localStorage.getItem("orders")) || [];

      const newOrder = {
        id: Date.now(),
        items: checkoutItems,
        amount: checkoutAmount,
        address: checkoutAddress,
        paymentMethod: "COD",
        placedDate: new Date().toLocaleString(),
        userId: user?.id,
        status: "Placed",
      };

      localStorage.setItem(
        "orders",
        JSON.stringify([...existingOrders, newOrder])
      );

      localStorage.removeItem("checkoutItems");
      localStorage.removeItem("checkoutAmount");
      localStorage.removeItem("checkoutAddress");

      clearCart();
      navigate("/order-success");
      return;
    }

    /* ================= RAZORPAY ================= */
    try {
      // 1️⃣ Create Razorpay order
      const { data } = await paymentApi.post(
        "/payment/create-order",
        {
          amount: checkoutAmount.total,
        }
      );

      const orderId = data.orderId;

      const options = {
  key: "rzp_test_SH4Bhcf8mzwGFx",
  amount: checkoutAmount.total * 100,
  currency: "INR",
  name: "ShopVerse",
  description: "Order Payment",
  order_id: orderId,

  handler: async function (response) {
    try {
      await paymentApi.post("/payment/verify", {
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
        userEmail: user.email,
        amount: checkoutAmount.total,
        paymentMethod: method,
      });

      const existingOrders =
        JSON.parse(localStorage.getItem("orders")) || [];

      const newOrder = {
        id: Date.now(),
        items: checkoutItems,
        amount: checkoutAmount,
        address: checkoutAddress,
        paymentMethod: method,
        placedDate: new Date().toLocaleString(),
        userId: user?.id,
        status: "Paid",
      };

      localStorage.setItem(
        "orders",
        JSON.stringify([...existingOrders, newOrder])
      );

      localStorage.removeItem("checkoutItems");
      localStorage.removeItem("checkoutAmount");
      localStorage.removeItem("checkoutAddress");

      clearCart();

      // ✅ FORCE redirect
      window.location.href = "/order-success";

    } catch (err) {
      setError("Payment verification failed");
    }
  },

  modal: {
    ondismiss: function () {
      console.log("Payment popup closed");
    },
  },

  prefill: {
    name: user?.name,
    email: user?.email,
  },

  theme: {
    color: "#dc2626",
  },
};


      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError("Payment failed. Try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-4">
      <CheckoutSteps currentStep={3} />

      <div className="mx-auto mt-4 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3 items-start">

        {/* LEFT */}
        <div className="md:col-span-2 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Payment Options
          </h2>

          {error && (
            <div className="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {[
            ["card", <CreditCard size={18} />, "Card / UPI / Net Banking"],
            ["wallet", <Wallet size={18} />, "Wallet"],
            ["cod", <Banknote size={18} />, "Cash on Delivery"],
          ].map(([key, icon, label]) => (
            <div
              key={key}
              onClick={() => setMethod(key)}
              className={`mb-2 flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 font-medium transition ${
                method === key
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
              className="rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Pay Now →
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rounded-xl bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-4 font-semibold text-gray-800">
            Price Details
          </h3>

          <div className="flex justify-between font-semibold text-gray-800">
            <span>Total</span>
            <span>₹{checkoutAmount?.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}