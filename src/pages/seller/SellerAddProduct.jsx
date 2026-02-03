import { useState, useEffect } from "react";
import { useSellerProducts } from "../../context/SellerProductContext";

export default function SellerAddProduct({ onClose }) {
  const { addSellerProduct } = useSellerProducts();

  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const [form, setForm] = useState({
    title: "",
    category: "",
    mrp: "",
    discount: "",
    stock: "",
    images: [""],
    about: "",
    highlights: "",
    material: "",
    usage: "",
    care: "",
    warranty: "",
    expiryDate: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (index, value) => {
    const imgs = [...form.images];
    imgs[index] = value;
    setForm({ ...form, images: imgs });
  };

  const addImageField = () =>
    setForm({ ...form, images: [...form.images, ""] });

  const calculatePrice = () => {
    const mrp = Number(form.mrp);
    const discount = Number(form.discount);
    if (!mrp) return 0;
    return Math.round(mrp - (mrp * discount) / 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.category || !form.mrp || !form.stock) {
      alert("Please fill all required fields");
      return;
    }

    addSellerProduct({
      title: form.title.trim(),
      category: form.category,
      mrp: Number(form.mrp),
      discount: Number(form.discount) || 0,
      price: calculatePrice(),
      stock: Number(form.stock),
      images: form.images.filter(Boolean),
      description: {
        about: form.about || "",
        highlights: form.highlights
          ? form.highlights.split("\n")
          : [],
        material: form.material || "",
        usage: form.usage || "",
        care: form.care || "",
        warranty: form.warranty || "",
        expiryDate: form.expiryDate || "",
      },
      reviews: [],
      sold: 0,
      revenue: 0,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Add New Product
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
      
          <div>
            <h4 className="mb-2 font-medium text-gray-700">
              Basic Information
            </h4>

            <input
              name="title"
              placeholder="Product Name *"
              onChange={handleChange}
              className="mb-2 w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-red-500"
            />

            <select
              name="category"
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Category *</option>
              <option>Mobiles</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Beauty</option>
              <option>Grocery</option>
              <option>Home</option>
            </select>
          </div>

        
          <div>
            <h4 className="mb-2 font-medium text-gray-700">
              Pricing
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="number"
                name="mrp"
                placeholder="MRP *"
                onChange={handleChange}
                className="rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-red-500"
              />
              <input
                type="number"
                name="discount"
                placeholder="Discount (%)"
                onChange={handleChange}
                className="rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Selling Price: <strong>₹{calculatePrice()}</strong>
            </p>

            <input
              type="number"
              name="stock"
              placeholder="Stock *"
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>

        
          <div>
            <h4 className="mb-2 font-medium text-gray-700">
              Description
            </h4>

            <textarea
              name="about"
              placeholder="About this product"
              onChange={handleChange}
              rows={3}
              className="mb-2 w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-red-500"
            />

            <textarea
              name="highlights"
              placeholder="Highlights (one per line)"
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-700">
              Product Images
            </h4>

            {form.images.map((img, i) => (
              <input
                key={i}
                placeholder="Image URL"
                value={img}
                onChange={(e) =>
                  handleImageChange(i, e.target.value)
                }
                className="mb-2 w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-red-500"
              />
            ))}

            <button
              type="button"
              onClick={addImageField}
              className="text-sm text-red-600 hover:underline"
            >
              + Add Image
            </button>
          </div>

    
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
