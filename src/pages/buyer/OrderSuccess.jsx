import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

export default function OrderSuccess() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    const orders =
      JSON.parse(localStorage.getItem("orders")) || [];

    
    if (orders.length === 0) {
      navigate("/cart", { replace: true });
      return;
    }

    const latestOrder = orders[orders.length - 1];
    setOrder(latestOrder);
  }, [navigate]);

  if (!order) return null;

  
  const downloadInvoice = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("SHOPVERSE INVOICE", 14, y);

    y += 10;
    doc.setFontSize(11);
    doc.text(`Order ID: ${order.id}`, 14, y);
    y += 6;
    doc.text(`Order Date: ${order.placedDate}`, 14, y);

    y += 10;
    doc.setFontSize(13);
    doc.text("Delivery Address", 14, y);

    y += 6;
    doc.setFontSize(11);
    doc.text(order.address?.name || "", 14, y);
    y += 5;
    doc.text(order.address?.phone || "", 14, y);
    y += 5;
    doc.text(
      `${order.address?.address}, ${order.address?.city}, ${order.address?.state} - ${order.address?.pincode}`,
      14,
      y
    );

    y += 10;
    doc.setFontSize(13);
    doc.text("Order Items", 14, y);

    y += 6;
    doc.setFontSize(11);
    order.items.forEach((item) => {
      const qty = item.quantity || 1;
      const price = item.price || 0;

      doc.text(
        `${item.title} | Qty: ${qty} | ₹${price * qty}`,
        14,
        y
      );
      y += 6;
    });

    y += 6;
    doc.line(14, y, 195, y);

    y += 8;
    doc.setFontSize(12);
    doc.text(`Total Paid: ₹${order.amount?.total}`, 14, y);

    y += 6;
    doc.text(
      `Payment Method: ${order.paymentMethod}`,
      14,
      y
    );

    doc.save(`Invoice_${order.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
            ✔
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Order Placed Successfully!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Thank you for shopping with ShopVerse
          </p>
        </div>

        
        <div className="mb-6 flex justify-center">
          <button
            onClick={downloadInvoice}
            className="rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            ⬇ Download Invoice (PDF)
          </button>
        </div>

        
        <div className="rounded-2xl bg-white p-6 shadow-md">
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="font-semibold">{order.id}</p>
            </div>

            
            <div className="text-right">
              <p className="text-gray-500">Order Date</p>
              <p className="font-semibold">{order.placedDate}</p>
            </div>
          </div>

          <hr className="my-6" />

          
          <h4 className="mb-2 font-semibold text-gray-800">
            Delivery Address
          </h4>
          <p className="text-sm text-gray-600">
            {order.address?.name}
          </p>
          <p className="text-sm text-gray-600">
            {order.address?.phone}
          </p>
          <p className="text-sm text-gray-600">
            {order.address?.address}, {order.address?.city},{" "}
            {order.address?.state} - {order.address?.pincode}
          </p>

          <hr className="my-6" />

          
          <h4 className="mb-3 font-semibold text-gray-800">
            Order Items
          </h4>

          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity || 1}
                  </p>
                </div>
                <p className="font-semibold text-gray-800">
                  ₹{(item.price || 0) * (item.quantity || 1)}
                </p>
              </div>
            ))}
          </div>

          <hr className="my-6" />

          
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total Paid</span>
            <span className="text-green-600">
              ₹{order.amount?.total}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            Payment Method:{" "}
            <strong className="text-gray-800">
              {order.paymentMethod}
            </strong>
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate("/orders")}
            className="rounded-lg border px-6 py-2 text-sm font-medium hover:bg-gray-100 transition"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
