import { useEffect, useState } from "react";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} from "../../api/couponApi";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    code: "",
    discountPercentage: "",
    minOrderAmount: "",
    expiryDate: "",
    active: true,
  });

  /* ================= TOAST ================= */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ================= LOAD ALL ================= */
  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await getAllCoupons();
      setCoupons(res.data);
    } catch (err) {
      showToast("Failed to load coupons", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ================= OPEN CREATE ================= */
  const openCreateForm = () => {
    setEditingId(null);
    setForm({
      code: "",
      discountPercentage: "",
      minOrderAmount: "",
      expiryDate: "",
      active: true,
    });
    setShowForm(true);
  };

  /* ================= OPEN EDIT ================= */
  const openEditForm = (coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      minOrderAmount: coupon.minOrderAmount,
      expiryDate: coupon.expiryDate || "",
      active: coupon.active,
    });
    setShowForm(true);
  };

  /* ================= SAVE ================= */
  const handleSubmit = async () => {
    try {
      const payload = {
        code: form.code.toUpperCase(),
        discountPercentage: Number(form.discountPercentage),
        minOrderAmount: Number(form.minOrderAmount),
        expiryDate: form.expiryDate || null,
        active: form.active,
      };

      if (editingId) {
        await updateCoupon(editingId, payload);
        showToast("Coupon updated successfully");
      } else {
        await createCoupon(payload);
        showToast("Coupon created successfully");
      }

      setShowForm(false);
      loadCoupons();
    } catch (err) {
      showToast("Operation failed", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await deleteCoupon(id);
      showToast("Coupon deleted successfully");
      loadCoupons();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ================= TOAST ================= */}
      {toast && (
        <div className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white z-50
          ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}>
          {toast.message}
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Coupon Management
        </h2>

        <button
          onClick={openCreateForm}
          className="bg-red-600 hover:bg-red-700 transition text-white px-5 py-2 rounded-lg shadow"
        >
          + Create Coupon
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-center">Discount</th>
                <th className="p-3 text-center">Min Order</th>
                <th className="p-3 text-center">Expiry</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && coupons.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    No coupons available
                  </td>
                </tr>
              )}

              {coupons.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 font-semibold">{c.code}</td>
                  <td className="p-3 text-center">{c.discountPercentage}%</td>
                  <td className="p-3 text-center">₹{c.minOrderAmount}</td>
                  <td className="p-3 text-center">
                    {c.expiryDate || "No Expiry"}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${c.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"}`}
                    >
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => openEditForm(c)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-40">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-4 animate-fadeIn">
            <h3 className="text-lg font-semibold">
              {editingId ? "Update Coupon" : "Create Coupon"}
            </h3>

            <input
              name="code"
              placeholder="Coupon Code"
              value={form.code}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
            />

            <input
              name="discountPercentage"
              type="number"
              placeholder="Discount %"
              value={form.discountPercentage}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
            />

            <input
              name="minOrderAmount"
              type="number"
              placeholder="Minimum Order Amount"
              value={form.minOrderAmount}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
            />

            <input
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              Active
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded-lg"
              >
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}