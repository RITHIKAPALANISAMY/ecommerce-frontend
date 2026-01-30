import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function CheckoutSummary() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [amount, setAmount] = useState(null);

  /* ================= LOAD SINGLE SOURCE ================= */
  useEffect(() => {
    const savedAmount = JSON.parse(
      localStorage.getItem("checkoutAmount")
    );
    const savedAddress = JSON.parse(
      localStorage.getItem("checkoutAddress")
    );
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const inStockItems = cart.filter(
      (i) => i.stock === undefined || i.stock > 0
    );

    if (
      !user ||
      !savedAmount ||
      !savedAddress ||
      inStockItems.length === 0
    ) {
      navigate("/cart", { replace: true });
      return;
    }

    setItems(inStockItems);
    setAddress(savedAddress);
    setAmount(savedAmount);
  }, [user, navigate]);

  if (!amount || !address) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <CheckoutSteps currentStep={2} />

      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {/* LEFT */}
        <div className="md:col-span-2 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">
            Order Summary
          </h2>

          {items.map((item) => (
            <div
              key={item.id}
              className="mb-4 flex gap-4 border-b pb-4 last:border-none"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-16 w-16 rounded border object-contain"
              />

              <div className="flex-1">
                <p className="font-medium">
                  {item.title}
                </p>
                <p className="text-sm text-gray-600">
                  Qty: {item.qty}
                </p>
              </div>

              <p className="font-semibold">
                ₹{item.price * item.qty}
              </p>
            </div>
          ))}

          <h4 className="mt-4 mb-2 font-semibold">
            Deliver to
          </h4>

          <div className="rounded-lg border p-3 text-sm">
            <p className="font-medium">{address.name}</p>
            <p>{address.phone}</p>
            <p>
              {address.address}, {address.city},{" "}
              {address.state} - {address.pincode}
            </p>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => navigate("/checkout/address")}
              className="rounded border px-4 py-2"
            >
              Back
            </button>

            <button
              onClick={() => navigate("/checkout/payment")}
              className="rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700"
            >
              Continue to Payment →
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="h-fit rounded-xl bg-white p-6 shadow">
          <h3 className="mb-4 font-semibold">
            Price Details
          </h3>

          <div className="mb-2 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{amount.subtotal}</span>
          </div>

          <div className="mb-2 flex justify-between text-sm">
            <span>Shipping</span>
            <span>₹{amount.shipping}</span>
          </div>

          <div className="mb-2 flex justify-between text-sm">
            <span>GST</span>
            <span>₹{amount.gst}</span>
          </div>

          {amount.discount > 0 && (
            <div className="mb-2 flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-₹{amount.discount}</span>
            </div>
          )}

          <hr className="my-3" />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{amount.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
