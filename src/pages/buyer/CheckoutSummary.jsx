import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import CheckoutSteps from "./CheckoutSteps";

export default function CheckoutSummary() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  const loadData = async () => {

    try {

      const addressId =
        localStorage.getItem("checkoutAddressId");

      if (!addressId) {
        navigate("/checkout/address");
        return;
      }

      /* ✅ GET STORED CHECKOUT DATA */
      const storedSummary =
        JSON.parse(
          localStorage.getItem("checkoutAmount")
        );

      const storedItems =
        JSON.parse(
          localStorage.getItem("checkoutItems")
        );

      if (!storedItems || storedItems.length === 0) {
        navigate("/cart");
        return;
      }

      setCartItems(storedItems);

      setSummary(storedSummary);

    } catch (err) {

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
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <CheckoutSteps currentStep={2} />

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mt-8">

        {/* LEFT - ORDER SUMMARY */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-white rounded-2xl shadow-md p-8"
        >
          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            🛍️ Order Summary
          </h2>

          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              className="border rounded-lg p-5 mb-4 bg-gray-50 hover:shadow-sm transition"
            >
              {/* Top Row */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-medium text-gray-800">
                  {item.productName}
                </h3>

                <div className="text-base font-semibold text-gray-900">
                  ₹
                  {(Number(item.price) *
                    Number(item.quantity)).toFixed(2)}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex gap-6 text-sm text-gray-600">
                <div>
                  Qty:{" "}
                  <span className="font-medium text-gray-800">
                    {item.quantity}
                  </span>
                </div>

                <div>
                  Unit:{" "}
                  <span className="font-medium text-gray-800">
                    ₹{Number(item.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* RIGHT - PRICE DETAILS */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-md p-8 h-fit"
        >
          <h3 className="text-base font-semibold mb-6 text-gray-800">
            💳 Price Details
          </h3>

          {summary && (
            <>
              <div className="space-y-3 text-sm text-gray-700">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ₹{summary.subtotal.toFixed(2)}
                  </span>
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

    <span className="font-medium">
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
                  <span>GST (18%)</span>
                  <span className="font-medium">
                    ₹{summary.gst.toFixed(2)}
                  </span>
                </div>

                {summary.discount > 0 && (

  <div className="flex justify-between text-green-600">

    <span>Coupon Discount</span>

    <span>
      -₹{summary.discount.toFixed(2)}
    </span>

  </div>

)}

              </div>

              <hr className="my-5" />

              <div className="flex justify-between text-lg font-bold text-red-600">
                <span>Total</span>
                <span>
  ₹{Number(
    summary.total ??
summary.totalAmount 
  ).toFixed(2)}
</span>
              </div>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/checkout/payment")}
            className="mt-6 w-full bg-red-600 text-white py-3 rounded-lg font-medium text-sm shadow-sm hover:bg-red-700 transition"
          >
            Proceed to Payment →
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}