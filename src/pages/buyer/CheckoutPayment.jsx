import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import CheckoutSteps from "./CheckoutSteps";
import paymentApi from "../../api/paymentApi";
import { CreditCard, Wallet, Banknote } from "lucide-react";

const PRODUCT_API = "http://localhost:8082/api/products";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { placeOrder } = useOrders();

  const [method, setMethod] = useState(
    () => localStorage.getItem("paymentMethod") || "card"
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkoutAmount = JSON.parse(localStorage.getItem("checkoutAmount"));
  const checkoutAddress = JSON.parse(localStorage.getItem("checkoutAddress"));
  const checkoutItems =
    JSON.parse(localStorage.getItem("checkoutItems")) || [];

  useEffect(() => {
    localStorage.setItem("paymentMethod", method);
  }, [method]);

  const cleanUp = () => {
    clearCart();
    localStorage.removeItem("checkoutItems");
    localStorage.removeItem("checkoutAmount");
    localStorage.removeItem("checkoutAddress");
    localStorage.removeItem("paymentMethod");
  };

  const formatAddress = (address) => {
    if (!address) return "";
    if (typeof address === "string") return address;

    return `${address.street || ""}, ${address.city || ""}, ${
      address.state || ""
    } - ${address.pincode || ""}`;
  };

  const handlePlaceOrder = async () => {
    if (loading) return;

    setError("");

    if (!checkoutAmount || !checkoutAddress || checkoutItems.length === 0) {
      setError("Checkout data missing");
      return;
    }

    const formattedAddress = formatAddress(checkoutAddress);

    const orderItems = checkoutItems.map((item) => ({
      productId: item.id || item._id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: item.quantity || 1,
      sellerEmail: item.sellerEmail,
    }));

    /* ================= COD ================= */
    if (method === "cod") {
      try {
        setLoading(true);

        const savedOrder = await placeOrder({
          address: formattedAddress,
          amount: checkoutAmount.total,
          paymentMethod: "cod",
          items: orderItems,
        });

        // reduce stock
        for (const item of orderItems) {
          await axios.post(`${PRODUCT_API}/reduce-stock`, null, {
            params: {
              productId: item.productId,
              quantity: item.quantity,
            },
          });
        }

        cleanUp();

        navigate("/order-success", {
          state: { order: savedOrder },
          replace: true,
        });

      } catch (err) {
        console.error("COD ERROR:", err);
        setError("Failed to place order");
      } finally {
        setLoading(false);
      }

      return;
    }

    /* ================= RAZORPAY ================= */
    try {
      setLoading(true);

      const { data } = await paymentApi.post("/payment/create-order", {
        amount: checkoutAmount.total,
      });

      const options = {
        key: "rzp_test_SH4Bhcf8mzwGFx",
        amount: checkoutAmount.total * 100,
        currency: "INR",
        name: "ShopVerse",
        description: "Order Payment",
        order_id: data.orderId,

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

            const savedOrder = await placeOrder({
              address: formattedAddress,
              amount: checkoutAmount.total,
              paymentMethod: method,
              items: orderItems,
            });

            for (const item of orderItems) {
              await axios.post(`${PRODUCT_API}/reduce-stock`, null, {
                params: {
                  productId: item.productId,
                  quantity: item.quantity,
                },
              });
            }

            cleanUp();

            navigate("/order-success", {
              state: { order: savedOrder },
              replace: true,
            });

          } catch (err) {
            console.error("Verification error:", err);
            setError("Payment verification failed");
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
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
      console.error("Payment error:", err);
      setError("Payment failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-4">
      <CheckoutSteps currentStep={3} />

      <div className="mx-auto mt-4 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
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
              className={`mb-2 flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 font-medium transition ${
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
              disabled={loading}
              className="rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Processing..." : "Pay Now →"}
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-800">
            Price Details
          </h3>

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{checkoutAmount?.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}