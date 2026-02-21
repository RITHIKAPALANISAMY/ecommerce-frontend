import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    if (!location.state?.order) {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  if (!order) return null;

  /* ================= DOWNLOAD INVOICE ================= */
  const downloadInvoice = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("SHOPVERSE INVOICE", 14, y);

    y += 10;
    doc.setFontSize(11);
    doc.text(`Order ID: ${order.id}`, 14, y);
    y += 6;
    doc.text(`Payment Method: ${order.paymentMethod}`, 14, y);
    y += 6;
    doc.text(`Total Paid: ₹${order.amount}`, 14, y);

    doc.save(`Invoice_${order.id}.pdf`);
  };

  return (
  <div className="min-h-screen bg-gray-50 py-14 px-4">
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-10">

      {/* ===== SUCCESS HEADER ===== */}
      <div className="text-center border-b pb-8">
        <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl mb-4">
          ✓
        </div>

        <h1 className="text-3xl font-bold text-gray-800">
          Order Confirmed 🎉
        </h1>

        <p className="text-gray-500 mt-2">
          Thank you for shopping with{" "}
          <span className="text-red-600 font-semibold">ShopVerse</span>
        </p>

        <p className="text-sm text-gray-600 mt-2">
          Order ID: <span className="font-semibold">{order.id}</span>
        </p>
      </div>

      {/* ===== ORDER ITEMS ===== */}
      <div className="py-8 border-b">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Order Items
        </h2>

        <div className="space-y-6">
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-6"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-24 w-24 object-cover rounded-lg border"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Quantity: {item.quantity || 1}
                </p>

                <p className="text-sm text-gray-500">
                  Price: ₹{item.price}
                </p>
              </div>

              <div className="font-semibold text-gray-800 text-lg">
                ₹{(item.price || 0) * (item.quantity || 1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== DELIVERY + PAYMENT ===== */}
      <div className="py-8 grid md:grid-cols-2 gap-10 border-b">

        {/* Delivery */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Delivery Address
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            {order.address}
          </p>
        </div>

        {/* Payment */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Payment Summary
          </h2>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span>₹{order.amount}</span>
            </div>

            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="capitalize">
                {order.paymentMethod}
              </span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between font-semibold text-lg text-green-600">
              <span>Paid</span>
              <span>₹{order.amount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ACTION BUTTONS ===== */}
      <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={downloadInvoice}
          className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
        >
          Download Invoice
        </button>

        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-100 transition"
        >
          View Orders
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          Continue Shopping
        </button>
      </div>

    </div>
  </div>
);
}