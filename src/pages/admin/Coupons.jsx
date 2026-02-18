import { useEffect, useState } from "react";

const STORAGE_KEY = "admin_coupons";
const BUYER_KEY = "coupons"; // shared with buyer

export default function Coupons() {
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    type: "",
    expiry: "",
    status: "Active",
  });

  /* ✅ STORE ADMIN + BUYER COPIES */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));

    const buyerCoupons = coupons.filter(
      (c) =>
        c.status === "Active" &&
        (!c.expiry || new Date(c.expiry) >= new Date())
    );

    localStorage.setItem(BUYER_KEY, JSON.stringify(buyerCoupons));
  }, [coupons]);

  /* ✅ REALTIME SYNC */
  useEffect(() => {
    const sync = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setCoupons(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.code || !form.discount || !form.type || !form.expiry) {
      alert("All fields are required");
      return;
    }

    const cleanedCoupon = {
      ...form,
      code: form.code.toUpperCase(),
      discount: Number(form.discount), // ✅ FIX
      type: form.type.toLowerCase(),    // ✅ FIX
    };

    if (editingId) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...cleanedCoupon, id: editingId } : c
        )
      );
      setEditingId(null);
    } else {
      setCoupons((prev) => [
        ...prev,
        { ...cleanedCoupon, id: Date.now() },
      ]);
    }

    setForm({
      code: "",
      discount: "",
      type: "",
      expiry: "",
      status: "Active",
    });
  };

  const handleEdit = (coupon) => {
    setForm(coupon);
    setEditingId(coupon.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        Coupons & Deals Management
      </h2>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            name="code"
            placeholder="Coupon Code"
            value={form.code}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <input
            name="discount"
            type="number"
            placeholder="Discount (10 / 50)"
            value={form.discount}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <input
            name="type"
            placeholder="flat / percentage"
            value={form.type}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <input
            name="expiry"
            type="date"
            value={form.expiry}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <button
            onClick={handleSave}
            className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Type</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  No coupons created yet
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{c.code}</td>
                  <td className="p-3">{c.discount}</td>
                  <td className="p-3">{c.type}</td>
                  <td className="p-3">{c.expiry}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        c.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-xs text-red-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}