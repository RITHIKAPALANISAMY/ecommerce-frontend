import { useState, useEffect } from "react";
import { useSellerProducts } from "../../context/SellerProductContext";

export default function SellerEditProduct({ product, onClose }) {
  const { updateSellerProduct } = useSellerProducts();

  /* LOCK BACKGROUND SCROLL */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const [form, setForm] = useState({
    title: product.title || "",
    category: product.category || "",
    mrp: product.mrp || "",
    discount: product.discount || "",
    stock: product.stock || "",
    images: product.images?.length ? product.images : [""],
    about: product.description?.about || "",
    highlights: product.description?.highlights
      ? product.description.highlights.join("\n")
      : "",
    material: product.description?.material || "",
    usage: product.description?.usage || "",
    care: product.description?.care || "",
    warranty: product.description?.warranty || "",
    expiryDate: product.description?.expiryDate || "",
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

  const handleSave = () => {
    if (!form.title || !form.mrp || !form.stock) {
      alert("Please fill all required fields");
      return;
    }

    updateSellerProduct({
      ...product,
      title: form.title,
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
    });

    onClose();
  };

  return (
    /* OVERLAY */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      
      {/* MODAL */}
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Edit Product
        </h3>

        {/* FORM */}
        <div className="space-y-6">
          {/* BASIC INFO */}
          <div>
            <h4 className="mb-2 font-medium text-gray-700">
              Basic Information
            </h4>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Product Name *"
              className="mb-2 w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* PRICING */}
          <div>
            <h4 className="mb-2 font-medium text-gray-700">
              Pricing
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                name="mrp"
                value={form.mrp}
                onChange={handleChange}
                placeholder="MRP *"
                className="rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <input
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="Discount (%)"
                className="rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Selling Price:{" "}
              <strong>₹{calculatePrice()}</strong>
            </p>

            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock *"
              className="mt-2 w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <h4 className="mb-2 font-medium text-gray-700">
              Description
            </h4>

            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={3}
              placeholder="About this product"
              className="mb-2 w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <textarea
              name="highlights"
              value={form.highlights}
              onChange={handleChange}
              rows={3}
              placeholder="Highlights (one per line)"
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* EXTRA DETAILS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              name="material"
              value={form.material}
              onChange={handleChange}
              placeholder="Material"
              className="rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              name="usage"
              value={form.usage}
              onChange={handleChange}
              placeholder="Usage"
              className="rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              name="care"
              value={form.care}
              onChange={handleChange}
              placeholder="Care Instructions"
              className="rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              name="warranty"
              value={form.warranty}
              onChange={handleChange}
              placeholder="Warranty"
              className="rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              placeholder="Expiry Date"
              className="rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* IMAGES */}
          <div>
            <h4 className="mb-2 font-medium text-gray-700">
              Product Images
            </h4>

            {form.images.map((img, i) => (
              <input
                key={i}
                value={img}
                onChange={(e) =>
                  handleImageChange(i, e.target.value)
                }
                placeholder="Image URL"
                className="mb-2 w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ))}

            <button
              onClick={addImageField}
              className="text-sm text-red-600 hover:underline"
            >
              + Add Image
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
}
