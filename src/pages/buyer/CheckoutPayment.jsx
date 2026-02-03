import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CheckoutSteps from "./CheckoutSteps";
import { useAuth } from "../../context/AuthContext";
import { useSellerProducts } from "../../context/SellerProductContext";
import { useState } from "react";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const { clearCart } = useCart(); 
  const { user } = useAuth();
  const { reduceStockAfterOrder } = useSellerProducts();

  const [method, setMethod] = useState("cod");
  const [error, setError] = useState("");

  const checkoutAmount = JSON.parse(
    localStorage.getItem("checkoutAmount")
  );

  const checkoutAddress = JSON.parse(
    localStorage.getItem("checkoutAddress")
  );

  const checkoutItems = JSON.parse(
    localStorage.getItem("checkoutItems")
  ) || [];

  const fullCart = JSON.parse(
    localStorage.getItem("cart")
  ) || [];

  const handlePlaceOrder = () => {
    if (!checkoutItems || checkoutItems.length === 0) {
      setError("No items to place order");
      return;
    }

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
      status: "Placed",
    };

    localStorage.setItem(
      "orders",
      JSON.stringify([...existingOrders, newOrder])
    );

    const orderedIds = checkoutItems.map(i => i.id);

    const updatedCart = fullCart.filter(
      item => !orderedIds.includes(item.id)
    );

    const cleanedCart = updatedCart.map(item => {
      const { buyNow, ...rest } = item;
      return rest;
    });

    localStorage.setItem(
      "cart",
      JSON.stringify(cleanedCart)
    );

    localStorage.removeItem("checkoutItems");
    localStorage.removeItem("checkoutAmount");
    localStorage.removeItem("checkoutAddress");

    localStorage.setItem("orderPlaced", "true");

    navigate("/order-success");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-4">
      <CheckoutSteps currentStep={3} />

      <div className="mx-auto mt-4 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3 items-start">
        
        <div className="md:col-span-2 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Payment Options
          </h2>

          {error && (
            <div className="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          {[
            ["upi", "📱 UPI"],
            ["card", "💳 Card"],
            ["netbanking", "🏦 Net Banking"],
            ["wallet", "👛 Wallet"],
            ["cod", "💵 Cash on Delivery"],
          ].map(([key, label]) => (
            <div
              key={key}
              onClick={() => setMethod(key)}
              className={`mb-2 cursor-pointer rounded-lg border px-4 py-3 font-medium transition ${
                method === key
                  ? "border-red-600 bg-red-50"
                  : "hover:bg-gray-50"
              }`}
            >
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
              Place Order →
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-4 font-semibold text-gray-800">
            Price Details
          </h3>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>₹{checkoutAmount?.subtotal}</span>
          </div>

          <div className="mt-1 flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span>₹{checkoutAmount?.shipping}</span>
          </div>

          <div className="mt-1 flex justify-between text-sm text-gray-600">
            <span>GST</span>
            <span>₹{checkoutAmount?.gst}</span>
          </div>

          {checkoutAmount?.discount > 0 && (
            <div className="mt-1 flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-₹{checkoutAmount.discount}</span>
            </div>
          )}

          <hr className="my-3" />

          <div className="flex justify-between font-semibold text-gray-800">
            <span>Total</span>
            <span>₹{checkoutAmount?.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
