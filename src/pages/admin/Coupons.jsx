import React, { useState } from "react";
import "./Coupons.css"; 

const initialCoupons = [
  { id: 1, code: "SHOP10", discount: "10%", type: "Flat", expiry: "31 Jan 2026", status: "Active" },
  { id: 2, code: "NEWUSER20", discount: "20%", type: "Percentage", expiry: "15 Feb 2026", status: "Active" },
  { id: 3, code: "OLD50", discount: "₹50", type: "Flat", expiry: "01 Jan 2026", status: "Expired" },
];

export default function CouponsDashboard() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [editingId, setEditingId] = useState(null);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "", type: "", expiry: "", status: "Active" });

  const handleDelete = (id) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const handleEdit = (id) => {
    const coupon = coupons.find(c => c.id === id);
    setNewCoupon({ ...coupon });
    setEditingId(id);
  };

  const handleSave = () => {
    if (editingId) {
      setCoupons(coupons.map(c => (c.id === editingId ? newCoupon : c)));
      setEditingId(null);
    } else {
      setCoupons([...coupons, { ...newCoupon, id: Date.now() }]);
    }
    setNewCoupon({ code: "", discount: "", type: "", expiry: "", status: "Active" });
  };

  return (
    <div className="coupons-dashboard" style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
      <h2>Coupons & Deals</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Code"
          value={newCoupon.code}
          onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
        />
        <input
          type="text"
          placeholder="Discount"
          value={newCoupon.discount}
          onChange={e => setNewCoupon({ ...newCoupon, discount: e.target.value })}
        />
        <input
          type="text"
          placeholder="Type"
          value={newCoupon.type}
          onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value })}
        />
        <input
          type="date"
          placeholder="Expiry"
          value={newCoupon.expiry}
          onChange={e => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
        />
        <button onClick={handleSave} style={{ backgroundColor: "#800020", color: "white", marginLeft: "10px", padding: "5px 15px", borderRadius: "5px" }}>
          {editingId ? "Update" : "Add Coupon"}
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#f5f5f5" }}>
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
          {coupons.map(c => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>{c.discount}</td>
              <td>{c.type}</td>
              <td>{c.expiry}</td>
              <td style={{ color: c.status === "Active" ? "green" : "red" }}>{c.status}</td>
              <td>
                <button onClick={() => handleEdit(c.id)} style={{ marginRight: "10px", padding: "5px", cursor: "pointer" }}>Edit</button>
                <button onClick={() => handleDelete(c.id)} style={{ backgroundColor: "red", color: "white", padding: "5px", cursor: "pointer" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
