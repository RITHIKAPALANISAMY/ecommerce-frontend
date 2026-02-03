import { useEffect, useState } from "react";

const STORAGE_KEY = "admin_deals";

export default function Deals() {
  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    const today = new Date().toISOString().split("T")[0];

    return parsed.map((d) => ({
      ...d,
      status: d.expiry < today ? "Inactive" : "Active",
    }));
  });

  const [editingDeal, setEditingDeal] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discount: "",
    expiry: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  }, [deals]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.title || !form.discount || !form.expiry) {
      alert("Title, discount and expiry are required");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    setDeals((prev) => [
      ...prev,
      {
        ...form,
        id: Date.now(),
        status: form.expiry < today ? "Inactive" : "Active",
      },
    ]);

    setForm({
      title: "",
      description: "",
      discount: "",
      expiry: "",
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this deal?")) return;
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSave = () => {
    const today = new Date().toISOString().split("T")[0];

    setDeals((prev) =>
      prev.map((d) =>
        d.id === editingDeal.id
          ? {
              ...editingDeal,
              status:
                editingDeal.expiry < today
                  ? "Inactive"
                  : "Active",
            }
          : d
      )
    );

    setEditingDeal(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        Deals & Offers Management
      </h2>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <input
            name="discount"
            placeholder="Discount (30% / ₹500)"
            value={form.discount}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <input
            type="date"
            name="expiry"
            value={form.expiry}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={handleAdd}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"

        >
          Add Deal
        </button>
      </div>

      {deals.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
          No deals created yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-xl shadow p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {deal.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {deal.description || "—"}
                </p>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-full text-xs bg-primaryBg text-primary font-semibold">
                  {deal.discount}
                </span>

                <span
                  className={`text-xs font-semibold ${
                    deal.status === "Inactive"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {deal.status}
                </span>
              </div>

              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => setEditingDeal(deal)}
                  className="text-primary"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(deal.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingDeal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[320px]">
            <h3 className="font-semibold mb-4">
              Edit Deal
            </h3>

            <input
              value={editingDeal.title}
              onChange={(e) =>
                setEditingDeal({
                  ...editingDeal,
                  title: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full mb-2"
            />

            <input
              value={editingDeal.description}
              onChange={(e) =>
                setEditingDeal({
                  ...editingDeal,
                  description: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full mb-2"
            />

            <input
              value={editingDeal.discount}
              onChange={(e) =>
                setEditingDeal({
                  ...editingDeal,
                  discount: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full mb-2"
            />

            <input
              type="date"
              value={editingDeal.expiry}
              onChange={(e) =>
                setEditingDeal({
                  ...editingDeal,
                  expiry: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={handleSave}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingDeal(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}