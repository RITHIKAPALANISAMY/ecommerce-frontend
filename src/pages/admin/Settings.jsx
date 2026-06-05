import { useState } from "react";
import { toast } from "react-toastify";

export default function Settings() {

  /* ================= GENERAL ================= */

  const [general, setGeneral] = useState(() => {
    const saved = localStorage.getItem("platformGeneral");
    return saved
      ? JSON.parse(saved)
      : {
          storeName: "ShopVerse",
          supportEmail: "support@shopverse.com",
          gst: "",
          maintenance: false,
        };
  });

  /* ================= PAYMENT ================= */

  const [payment, setPayment] = useState(() => {
    const saved = localStorage.getItem("platformPayment");
    return saved
      ? JSON.parse(saved)
      : {
          razorpayKey: "",
          enablePayments: true,
          enableCOD: true,
          autoRefund: false,
        };
  });

  /* ================= COMMISSION ================= */

  const [commission, setCommission] = useState(() => {
    const saved = localStorage.getItem("platformCommission");
    return saved
      ? JSON.parse(saved)
      : {
          sellerCommission: 10,
          minWithdrawal: 500,
        };
  });

  /* ================= PROFILE ================= */

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("adminProfile");
    return saved
      ? JSON.parse(saved)
      : { name: "Admin", email: "admin@shopverse.com", phone: "" };
  });

  /* ================= PASSWORD ================= */

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  /* ================= SAVE FUNCTIONS ================= */

  const saveGeneral = () => {
    localStorage.setItem("platformGeneral", JSON.stringify(general));
    toast.success("General settings updated");
  };

  const savePayment = () => {
    localStorage.setItem("platformPayment", JSON.stringify(payment));
    toast.success("Payment settings updated");
  };

  const saveCommission = () => {

    if (commission.sellerCommission < 0 || commission.sellerCommission > 100) {
      return toast.error("Commission must be between 0 - 100%");
    }

    if (commission.minWithdrawal < 0) {
      return toast.error("Minimum withdrawal must be positive");
    }

    localStorage.setItem("platformCommission", JSON.stringify(commission));
    toast.success("Commission settings updated");
  };

  const saveProfile = () => {
    localStorage.setItem("adminProfile", JSON.stringify(profile));
    toast.success("Profile updated successfully");
  };

  const updatePassword = (e) => {
    e.preventDefault();

    if (!passwords.current || !passwords.next || !passwords.confirm)
      return toast.error("All fields required");

    if (passwords.next.length < 6)
      return toast.error("Password must be at least 6 characters");

    if (passwords.next !== passwords.confirm)
      return toast.error("Passwords do not match");

    toast.success("Password updated successfully");
    setPasswords({ current: "", next: "", confirm: "" });
  };

  /* ================= UI ================= */

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">⚙️ Platform Settings</h2>
        <p className="text-gray-500 text-sm">
          Configure your marketplace system
        </p>
      </div>

      {/* MAINTENANCE ALERT */}
      {general.maintenance && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          🚧 Platform is currently in Maintenance Mode
        </div>
      )}

      {/* GENERAL */}
      <Section title="🏪 General Settings">
        <Input
          label="Store Name"
          value={general.storeName}
          onChange={(v) => setGeneral({ ...general, storeName: v })}
        />

        <Input
          label="Support Email"
          value={general.supportEmail}
          onChange={(v) => setGeneral({ ...general, supportEmail: v })}
        />

        <Input
          label="GST Number"
          value={general.gst}
          onChange={(v) => setGeneral({ ...general, gst: v })}
        />

        <Toggle
          label="Maintenance Mode"
          value={general.maintenance}
          onChange={() =>
            setGeneral({ ...general, maintenance: !general.maintenance })
          }
        />

        <SaveButton onClick={saveGeneral} />
      </Section>

      {/* PAYMENT */}
      <Section title="💳 Payment Settings">

        <Input
          label="Razorpay Key"
          value={payment.razorpayKey}
          onChange={(v) =>
            setPayment({ ...payment, razorpayKey: v })
          }
          type="password"
        />

        <Toggle
          label="Enable Online Payments"
          value={payment.enablePayments}
          onChange={() =>
            setPayment({ ...payment, enablePayments: !payment.enablePayments })
          }
        />

        <Toggle
          label="Enable Cash on Delivery"
          value={payment.enableCOD}
          onChange={() =>
            setPayment({ ...payment, enableCOD: !payment.enableCOD })
          }
        />

        <Toggle
          label="Auto Refund"
          value={payment.autoRefund}
          onChange={() =>
            setPayment({ ...payment, autoRefund: !payment.autoRefund })
          }
        />

        <SaveButton onClick={savePayment} />
      </Section>

      {/* COMMISSION */}
      <Section title="💰 Commission Settings">

        <Input
          label="Seller Commission (%)"
          type="number"
          value={commission.sellerCommission}
          onChange={(v) =>
            setCommission({ ...commission, sellerCommission: Number(v) })
          }
        />

        <Input
          label="Minimum Withdrawal (₹)"
          type="number"
          value={commission.minWithdrawal}
          onChange={(v) =>
            setCommission({ ...commission, minWithdrawal: Number(v) })
          }
        />

        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          Example: On ₹1000 order → Seller earns ₹
          {(1000 - (1000 * commission.sellerCommission) / 100).toFixed(0)}
        </div>

        <SaveButton onClick={saveCommission} />
      </Section>

      {/* PROFILE + PASSWORD */}
      <div className="grid md:grid-cols-2 gap-6">

        <Section title="👤 Admin Profile">
          <Input
            label="Name"
            value={profile.name}
            onChange={(v) => setProfile({ ...profile, name: v })}
          />
          <Input
            label="Email"
            value={profile.email}
            onChange={(v) => setProfile({ ...profile, email: v })}
          />
          <Input
            label="Phone"
            value={profile.phone}
            onChange={(v) => setProfile({ ...profile, phone: v })}
          />
          <SaveButton onClick={saveProfile} />
        </Section>

        <Section title="🔐 Change Password">
          <form onSubmit={updatePassword} className="space-y-3">
            <Input
              label="Current Password"
              type="password"
              value={passwords.current}
              onChange={(v) =>
                setPasswords({ ...passwords, current: v })
              }
            />
            <Input
              label="New Password"
              type="password"
              value={passwords.next}
              onChange={(v) =>
                setPasswords({ ...passwords, next: v })
              }
            />
            <Input
              label="Confirm Password"
              type="password"
              value={passwords.confirm}
              onChange={(v) =>
                setPasswords({ ...passwords, confirm: v })
              }
            />
            <SaveButton type="submit" label="Update Password" />
          </form>
        </Section>

      </div>

    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#931012] outline-none"
      />
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm">{label}</span>
      <button
        onClick={onChange}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          value ? "bg-[#931012]" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
            value ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}

function SaveButton({ onClick, type = "button", label = "Save Changes" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-[#931012] text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
    >
      {label}
    </button>
  );
}