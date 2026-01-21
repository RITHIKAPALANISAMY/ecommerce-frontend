import React, { useState } from "react";
import "./Coupons.css";
const STORAGE_KEY = "admin_coupons";

const initialCoupons = [
  { id: 1, code: "SHOP10", discount: "10%", type: "Flat", expiry: "31 Jan 2026", status: "Active" },
  { id: 2, code: "NEWUSER20", discount: "20%", type: "Percentage", expiry: "15 Feb 2026", status: "Active" },
  { id: 3, code: "OLD50", discount: "₹50", type: "Flat", expiry: "01 Jan 2026", status: "Expired" },
];

export default function CouponsDashboard() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [editingId, setEditingId] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "",
    expiry: "",
    status: "Active",
  });

  const handleDelete = (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  const handleEdit = (id) => {
    const coupon = coupons.find((c) => c.id === id);
    setNewCoupon({ ...coupon });
    setEditingId(id);
  };

  const handleSave = () => {
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.type || !newCoupon.expiry) {
      alert("Fill all fields");
      return;
    }

    if (editingId) {
      setCoupons(coupons.map((c) => (c.id === editingId ? newCoupon : c)));
      setEditingId(null);
    } else {
      setCoupons([...coupons, { ...newCoupon, id: Date.now() }]);
    }

    setNewCoupon({ code: "", discount: "", type: "", expiry: "", status: "Active" });
  };

  return (
    <div className="coupons-dashboard">
      <h2>Coupons & Deals</h2>

      {/* ADD / EDIT FORM */}
      <div className="coupon-form">
        <input
          type="text"
          placeholder="Coupon Code"
          value={newCoupon.code}
          onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
        />

        <input
          type="text"
          placeholder="Discount (10% / ₹50)"
          value={newCoupon.discount}
          onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
        />

        <input
          type="text"
          placeholder="Type (Flat / Percentage)"
          value={newCoupon.type}
          onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
        />

        <input
          type="date"
          value={newCoupon.expiry}
          onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
        />

        <button onClick={handleSave}>
          {editingId ? "Update Coupon" : "Add Coupon"}
        </button>
      </div>

      {/* TABLE */}
      <table className="coupons-table">
        <thead>
          <tr>
            <th>Coupon Code</th>
            <th>Discount</th>
            <th>Type</th>
            <th>Expiry</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((c) => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>{c.discount}</td>
              <td>{c.type}</td>
              <td>{c.expiry}</td>
              <td>
                <span className={`status ${c.status.toLowerCase()}`}>
                  {c.status}
                </span>
              </td>
              <td>
                <div className="action-btns">
                  <button className="edit" onClick={() => handleEdit(c.id)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
