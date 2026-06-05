import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSprinkles, setShowSprinkles] = useState(true);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/id/${id}`);
        setOrder(res.data);
        await api.post(`/api/orders/${id}/send-confirmation-email`);
      } catch (err) {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Stop sprinkles after 5 seconds
    setTimeout(() => setShowSprinkles(false), 5000);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading order details...
      </div>
    );
  }

  if (!order) return null;
const downloadInvoice = () => {

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  /* =========================================
      COLORS
  ========================================= */

  const red = [140, 18, 18];
  const brown = [120, 53, 15];
  const dark = [31, 41, 55];
  const gray = [107, 114, 128];
  const border = [229, 231, 235];

  /* =========================================
      FORMAT CURRENCY
  ========================================= */

  const formatCurrency = (num) => {

    return `Rs. ${Number(num).toLocaleString("en-IN", {

      minimumFractionDigits: 2,
      maximumFractionDigits: 2,

    })}`;

  };

  /* =========================================
      INVOICE NUMBER
  ========================================= */

  const invoiceNo =
    "INV-" + order.id.slice(-8).toUpperCase();

  /* =========================================
      ORDER CALCULATIONS
  ========================================= */

  const subtotal =
    Number(order.subtotal || 0);

  const gst =
    Number(order.gst || 0);

  const delivery =
    Number(order.delivery || 0);

  /* FINAL TOTAL FROM BACKEND */

  const finalTotal =
    Number(order.totalAmount || 0);

  /* ORIGINAL TOTAL */

  const originalAmount =
    subtotal +
    gst +
    delivery;

  /* DISCOUNT */

  const discountAmount =
    originalAmount - finalTotal;

  /* COUPON */

  const couponPercentage =
    Number(
      order.couponPercentage ||
      order.appliedCoupon?.discount ||
      0
    );

  /* =========================================
      HEADER
  ========================================= */

  doc.setFillColor(...red);

  doc.rect(
    0,
    0,
    pageWidth,
    40,
    "F"
  );

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(26);

  doc.text(
    "ShopVerse",
    15,
    18
  );

  doc.setFontSize(11);

  doc.setFont("helvetica", "normal");

  doc.text(
    "Premium Tax Invoice",
    15,
    27
  );

  /* =========================================
      INVOICE BOX
  ========================================= */

  doc.setFillColor(255, 255, 255);

  doc.roundedRect(
    pageWidth - 78,
    10,
    62,
    22,
    3,
    3,
    "F"
  );

  doc.setTextColor(...dark);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(9);

  doc.text(
    "Invoice No",
    pageWidth - 73,
    18
  );

  doc.text(
    invoiceNo,
    pageWidth - 20,
    18,
    {
      align: "right",
    }
  );

  doc.text(
    "Order ID",
    pageWidth - 73,
    25
  );

  doc.text(
    order.id.slice(0, 16),
    pageWidth - 20,
    25,
    {
      align: "right",
    }
  );

  /* =========================================
      BILLING CARDS
  ========================================= */

  const cardY = 52;

  /* SELLER CARD */

  doc.setFillColor(255, 255, 255);

  doc.roundedRect(
    15,
    cardY,
    82,
    45,
    4,
    4,
    "F"
  );

  doc.setDrawColor(...border);

  doc.roundedRect(
    15,
    cardY,
    82,
    45,
    4,
    4
  );

  doc.setTextColor(...red);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(13);

  doc.text(
    "Sold By",
    21,
    63
  );

  doc.setTextColor(...dark);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(10);

  doc.text(
    "ShopVerse Pvt Ltd",
    21,
    72
  );

  doc.text(
    "Chennai, Tamil Nadu",
    21,
    79
  );

  doc.text(
    "India",
    21,
    86
  );

  doc.text(
    "GSTIN: 33ABCDE1234F1Z5",
    21,
    93
  );

  /* CUSTOMER CARD */

  doc.setFillColor(255, 255, 255);

  doc.roundedRect(
    112,
    cardY,
    82,
    45,
    4,
    4,
    "F"
  );

  doc.roundedRect(
    112,
    cardY,
    82,
    45,
    4,
    4
  );

  doc.setTextColor(...brown);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(13);

  doc.text(
    "Bill To",
    118,
    63
  );

  doc.setTextColor(...dark);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(10);

  doc.text(
    order.buyerName || "Customer",
    118,
    72
  );

  doc.text(
    order.buyerEmail,
    118,
    79
  );

  if (order.shippingAddress) {

    doc.text(
      order.shippingAddress.street || "",
      118,
      86
    );

    doc.text(
      `${order.shippingAddress.city || ""}, ${
        order.shippingAddress.state || ""
      }`,
      118,
      93
    );
  }

  /* =========================================
      PRODUCT TABLE
  ========================================= */

  const rows = order.items.map((item, index) => [

    index + 1,

    item.title,

    String(item.quantity),

    formatCurrency(item.price),

    formatCurrency(
      item.price * item.quantity
    ),

  ]);

  autoTable(doc, {

    startY: 110,

    head: [[
      "#",
      "Product",
      "Qty",
      "Unit Price",
      "Total"
    ]],

    body: rows,

    theme: "grid",

    styles: {

      font: "helvetica",

      fontSize: 10,

      cellPadding: 5,

      textColor: dark,

      lineColor: border,

      lineWidth: 0.5,

      overflow: "linebreak",

      valign: "middle",
    },

    headStyles: {

      fillColor: red,

      textColor: 255,

      fontStyle: "bold",

      halign: "center",

      fontSize: 11,
    },

    alternateRowStyles: {

      fillColor: [252, 252, 252],
    },

    columnStyles: {

      0: {
        halign: "center",
        cellWidth: 14,
      },

      1: {
        cellWidth: 82,
      },

      2: {
        halign: "center",
        cellWidth: 20,
      },

      3: {
        halign: "right",
        cellWidth: 35,
      },

      4: {
        halign: "right",
        cellWidth: 35,
      },
    },
  });

  const finalY =
    doc.lastAutoTable.finalY + 18;

  /* =========================================
      PAYMENT BADGE
  ========================================= */

  doc.setFillColor(
    22,
    163,
    74
  );

  doc.roundedRect(
    15,
    finalY,
    58,
    13,
    4,
    4,
    "F"
  );

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(10);

  doc.text(
    "PAYMENT SUCCESSFUL",
    44,
    finalY + 8,
    {
      align: "center",
    }
  );
/* =========================================
    PAYMENT DETAILS
========================================= */

const paymentMethod =
  order.paymentMethod || "UPI";

const paymentStatus =
  order.paymentStatus || "PAID";

const paymentDate =
  new Date(order.createdAt || Date.now())
    .toLocaleDateString("en-IN");

const transactionId =
  order.transactionId ||
  order.paymentId ||
  "TXN" + order.id.slice(-8);

/* PAYMENT BOX */

const paymentBoxY =
  finalY + 20;

doc.setFillColor(255, 255, 255);

doc.roundedRect(
  15,
  paymentBoxY,
  82,
  46,
  4,
  4,
  "F"
);

doc.setDrawColor(...border);

doc.roundedRect(
  15,
  paymentBoxY,
  82,
  46,
  4,
  4
);

/* TITLE */

doc.setFont("helvetica", "bold");

doc.setFontSize(12);

doc.setTextColor(...red);

doc.text(
  "Payment Details",
  21,
  paymentBoxY + 10
);

/* CONTENT */

doc.setFont("helvetica", "normal");

doc.setFontSize(9);

doc.setTextColor(...dark);

/* METHOD */

doc.text(
  "Method",
  21,
  paymentBoxY + 20
);

doc.text(
  `: ${paymentMethod}`,
  48,
  paymentBoxY + 20
);

/* STATUS */

doc.text(
  "Status",
  21,
  paymentBoxY + 28
);

doc.setTextColor(22, 163, 74);

doc.text(
  `: ${paymentStatus}`,
  48,
  paymentBoxY + 28
);

/* DATE */

doc.setTextColor(...dark);

doc.text(
  "Date",
  21,
  paymentBoxY + 36
);

doc.text(
  `: ${paymentDate}`,
  48,
  paymentBoxY + 36
);

/* TRANSACTION */

doc.text(
  "Txn ID",
  21,
  paymentBoxY + 44
);

doc.text(
  `: ${transactionId}`,
  48,
  paymentBoxY + 44
);
  /* =========================================
      SUMMARY BOX
  ========================================= */

  const summaryBoxX =
    pageWidth - 92;

  const summaryBoxWidth = 78;

  const summaryTop =
    finalY - 8;

  doc.setFillColor(255, 255, 255);

  doc.roundedRect(
    summaryBoxX,
    summaryTop,
    summaryBoxWidth,
    72,
    4,
    4,
    "F"
  );

  doc.setDrawColor(...border);

  doc.roundedRect(
    summaryBoxX,
    summaryTop,
    summaryBoxWidth,
    72,
    4,
    4
  );

  const labelX =
    summaryBoxX + 6;

  const valueX =
    summaryBoxX +
    summaryBoxWidth -
    6;

  doc.setFont("helvetica", "normal");

  doc.setFontSize(10);

  doc.setTextColor(...gray);

  /* SUBTOTAL */

  doc.text(
    "Subtotal",
    labelX,
    summaryTop + 12
  );

  doc.text(
    formatCurrency(subtotal),
    valueX,
    summaryTop + 12,
    {
      align: "right",
    }
  );

  /* GST */

  doc.text(
    "GST",
    labelX,
    summaryTop + 22
  );

  doc.text(
    formatCurrency(gst),
    valueX,
    summaryTop + 22,
    {
      align: "right",
    }
  );

  /* DELIVERY */

  doc.text(
    "Delivery",
    labelX,
    summaryTop + 32
  );

  doc.text(
    formatCurrency(delivery),
    valueX,
    summaryTop + 32,
    {
      align: "right",
    }
  );

  /* COUPON */

  doc.text(
    couponPercentage > 0
      ? `${couponPercentage}% Coupon Applied`
      : "Coupon Discount",
    labelX,
    summaryTop + 42
  );

  doc.setTextColor(
    22,
    163,
    74
  );

  doc.text(
    `- ${formatCurrency(discountAmount)}`,
    valueX,
    summaryTop + 42,
    {
      align: "right",
    }
  );

  /* DIVIDER */

  doc.setDrawColor(220);

  doc.line(
    labelX,
    summaryTop + 48,
    valueX,
    summaryTop + 48
  );

  /* GRAND TOTAL */

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(15);

  doc.setTextColor(...red);

  doc.text(
    "Grand Total",
    labelX,
    summaryTop + 62
  );

  doc.text(
    formatCurrency(order.totalAmount),
    valueX,
    summaryTop + 62,
    {
      align: "right",
    }
  );

  /* =========================================
      FOOTER
  ========================================= */

  doc.setDrawColor(...border);

  doc.line(
    15,
    pageHeight - 25,
    pageWidth - 15,
    pageHeight - 25
  );

  doc.setTextColor(...gray);

  doc.setFontSize(9);

  doc.setFont("helvetica", "normal");

  doc.text(
    "Thank you for shopping with ShopVerse",
    pageWidth / 2,
    pageHeight - 16,
    {
      align: "center",
    }
  );

  doc.text(
    "This invoice is electronically generated.",
    pageWidth / 2,
    pageHeight - 10,
    {
      align: "center",
    }
  );

  /* =========================================
      SAVE PDF
  ========================================= */

  doc.save(
    `ShopVerse_${invoiceNo}.pdf`
  );
};

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-14 px-4 overflow-hidden">

      {/* SPRINKLES */}
      {showSprinkles &&
        Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * window.innerWidth }}
            animate={{ y: window.innerHeight }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: 0
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"][
                Math.floor(Math.random() * 4)
              ]
            }}
          />
        ))}

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border relative z-10">

        {/* SUCCESS ICON */}
        <div className="flex flex-col items-center text-center">

          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
          >
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h1 className="text-3xl font-bold mt-6 text-gray-800">
            Order Placed Successfully 🎉
          </h1>

          <p className="text-gray-500 mt-2">
            Thank you for shopping with
            <span className="text-blue-600 font-semibold"> ShopVerse</span>
          </p>

          <div className="mt-6 bg-blue-50 px-6 py-4 rounded-xl">
            <p className="text-sm text-gray-600">
              Order ID: <span className="font-semibold">{order.id}</span>
            </p>
            <p className="text-lg font-bold text-green-600 mt-1">
              ₹{order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="mt-10 border-t pt-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Payment Summary
          </h2>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>GST</span>
              <span>₹{order.gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>₹{order.delivery.toFixed(2)}</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg text-blue-600">
              <span>Grand Total</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ITEMS */}
        <div className="mt-10 border-t pt-8">
          <h2 className="text-xl font-semibold mb-6">
            Items Ordered
          </h2>

          <div className="space-y-6">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-6 border rounded-xl p-4 hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>

                <div className="font-bold text-lg text-gray-800">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={downloadInvoice}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Download Invoice
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="px-8 py-3 border rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            View Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:opacity-90 transition"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}