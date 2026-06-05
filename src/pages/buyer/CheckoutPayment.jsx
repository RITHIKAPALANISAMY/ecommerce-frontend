import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import paymentApi from "../../api/paymentApi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import CheckoutSteps from "./CheckoutSteps";
import { CreditCard, Wallet, Banknote } from "lucide-react";
import api from "../../api/axios";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { placeOrder } = useOrders();

  const [method, setMethod] = useState("CARD");
  const [summary, setSummary] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const addressId = localStorage.getItem("checkoutAddressId");
        if (!addressId) {
          navigate("/checkout/address");
          return;
        }

        const addressListRes =
  await api.get("/user/address");

/* ✅ LOAD STORED CHECKOUT DATA */
const storedSummary =
  JSON.parse(
    localStorage.getItem("checkoutAmount")
  );

const storedItems =
  JSON.parse(
    localStorage.getItem("checkoutItems")
  );

const selected =
  (addressListRes.data || []).find(
    (addr) =>
      String(addr.id) === String(addressId)
  );

setSummary(storedSummary || null);

setCartItems(storedItems || []);

setSelectedAddress(selected || null);
      } catch {
        setError("Failed to load checkout data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      setError("");

      if (!summary || !selectedAddress) {
        throw new Error("Incomplete checkout data");
      }

      const orderPayload = {
        shippingAddress: selectedAddress,
        subtotal: summary.subtotal,
        gst: summary.gst,
        delivery:
  summary.delivery ??
  summary.shipping ??
  0,
        totalAmount:
  summary.total ??
  summary.totalAmount,
        paymentMethod: method,
        items: cartItems.map((item) => ({
          productId: item.productId,
          title: item.title || item.productName || item.name || "Product",
          price:
  item.finalPrice ||
  item.discountedPrice ||
  item.price,
          image: item.image,
          quantity: item.quantity,
          sellerEmail: item.sellerEmail,
        })),
      };

      if (method === "COD") {
        const order = await placeOrder(orderPayload);
        clearCart();
        navigate(`/order-success/${order.id}`);
        return;
      }

      const res = await paymentApi.post("/payment/create-order", {
        amount:
  summary.total ??
  summary.totalAmount,
      });

      const { orderId, amount, key } = res.data;

      const options = {
        key,
        amount,
        currency: "INR",
        name: "ShopVerse",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          await paymentApi.post("/payment/verify", {
            razorpayOrderId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            userEmail: user.email,
            amount:
  summary.total ??
  summary.totalAmount,
            paymentMethod: method,
          });

          const order = await placeOrder(orderPayload);
          clearCart();
          navigate(`/order-success/${order.id}`);
        },
        theme: { color: "#dc2626" },
      };

      const isLoaded = await loadRazorpayScript();

if (!isLoaded) {
  setError("Razorpay SDK failed to load.");
  return;
}

if (!window.Razorpay) {
  setError("Razorpay not available.");
  return;
}

const rzp = new window.Razorpay(options);
rzp.open();
    } catch (err) {
      setError(err.message || "Payment failed.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading payment...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <CheckoutSteps currentStep={3} />

      <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">

        {/* LEFT SECTION */}
        <div className="md:col-span-2 rounded-2xl bg-white p-8 shadow-md">

          <h2 className="mb-6 text-lg font-semibold">
            Choose Payment Method
          </h2>

          {error && (
            <div className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {[
            ["CARD", <CreditCard size={18} />, "Credit / Debit Card & UPI"],
            ["WALLET", <Wallet size={18} />, "Wallet Payment"],
            ["COD", <Banknote size={18} />, "Cash on Delivery"],
          ].map(([keyName, icon, label]) => (
            <motion.div
              key={keyName}
              whileHover={{ scale: 1.02 }}
              onClick={() => setMethod(keyName)}
              className={`mb-4 flex cursor-pointer items-center gap-4 rounded-xl border px-5 py-4 text-sm transition ${
                method === keyName
                  ? "border-red-600 bg-red-50"
                  : "hover:bg-gray-50"
              }`}
            >
              {icon}
              <span className="font-medium">{label}</span>
            </motion.div>
          ))}

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => navigate("/checkout/summary")}
              className="rounded-lg border px-5 py-2 text-sm hover:bg-gray-50"
            >
              ← Back
            </button>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="rounded-lg bg-red-600 px-8 py-3 text-sm font-medium text-white hover:bg-red-700 transition"
            >
              {placingOrder ? "Processing..." : "Place Order →"}
            </button>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="rounded-2xl bg-white p-8 shadow-md h-fit">

          <h3 className="mb-6 text-base font-semibold">
            Order Details
          </h3>

          {summary && (
            <>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{summary.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  {Number(
  summary.delivery ??
  summary.shipping ??
  0
) === 0 ? (

  <span className="text-green-600 font-medium">
    FREE
  </span>

) : (

  <span>
    ₹{
      Number(
        summary.delivery ??
        summary.shipping ??
        0
      ).toFixed(2)
    }
  </span>

)}
                </div>

                <div className="flex justify-between">
                  <span>GST</span>
                  <span>₹{summary.gst.toFixed(2)}</span>
                </div>
              </div>

              {summary.discount > 0 && (

  <div className="flex justify-between text-green-600">

    <span>Coupon Discount</span>

    <span>
      -₹{summary.discount.toFixed(2)}
    </span>

  </div>

)}

              <hr className="my-6" />

              <div className="flex justify-between text-lg font-bold text-red-600">
                <span>Total</span>
                <span>₹{Number(
  summary.total ??
  summary.totalAmount ??
  0
).toFixed(2)}</span>
              </div>
            </>
          )}

          <p className="mt-4 text-xs text-gray-500">
            100% Secure Payments via Razorpay
          </p>
        </div>

      </div>
    </div>
  );
}