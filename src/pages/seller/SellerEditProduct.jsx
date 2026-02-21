import { useState, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";

export default function SellerEditProduct({ product, onClose }) {
  const { updateProduct } = useProducts();

  /* ================= DISABLE BACKGROUND SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    title: product?.title || "",
    brand: product?.brand || "",
    categoryId: product?.categoryId || "",
    mrp: product?.mrp || "",
    discount: product?.discount || "",
    stock: product?.stock || "",
    images: product?.images?.length ? product.images : [""],
    about: product?.description?.about || "",
    highlights: product?.description?.highlights
      ? product.description.highlights.join("\n")
      : "",
    material: product?.description?.material || "",
    usage: product?.description?.usage || "",
    care: product?.description?.care || "",
    warranty: product?.description?.warranty || "",
    expiryDate: product?.description?.expiryDate || "",
  });

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= IMAGE HANDLER ================= */
  const handleImageChange = (index, value) => {
    const updatedImages = [...form.images];
    updatedImages[index] = value;
    setForm({ ...form, images: updatedImages });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ""] });
  };

  /* ================= PRICE CALCULATION ================= */
  const calculatePrice = () => {
    const mrp = Number(form.mrp);
    const discount = Number(form.discount);

    if (!mrp) return 0;

    return Math.round(mrp - (mrp * discount) / 100);
  };

  /* ================= SAVE PRODUCT ================= */
  const handleSave = async () => {
    if (
      !form.title.trim() ||
      !form.brand.trim() ||
      !form.categoryId ||
      !form.mrp ||
      !form.stock
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const updatedProduct = {
        title: form.title.trim(),
        brand: form.brand.trim(),
        categoryId: form.categoryId,
        mrp: Number(form.mrp),
        discount: Number(form.discount) || 0,
        price: calculatePrice(),
        stock: Number(form.stock),
        images: form.images.filter((img) => img.trim() !== ""),
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
      };

      await updateProduct(product.id, updatedProduct);

      alert("Product updated successfully ✅");
      onClose();

    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update product");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Edit Product
        </h3>

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
              className="mb-2 w-full rounded-lg border px-4 py-2 text-sm"
            />

            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand *"
              className="mb-2 w-full rounded-lg border px-4 py-2 text-sm"
            />

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 text-sm"
            >
              <option value="">Select Category *</option>
              <option value="Mobiles">Mobiles</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Beauty">Beauty</option>
              <option value="Grocery">Grocery</option>
              <option value="Home">Home</option>
            </select>
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
                className="rounded-lg border px-4 py-2 text-sm"
              />

              <input
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="Discount (%)"
                className="rounded-lg border px-4 py-2 text-sm"
              />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Selling Price: <strong>₹{calculatePrice()}</strong>
            </p>

            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock *"
              className="mt-2 w-full rounded-lg border px-4 py-2 text-sm"
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
              className="mb-2 w-full rounded-lg border px-4 py-2 text-sm"
            />

            <textarea
              name="highlights"
              value={form.highlights}
              onChange={handleChange}
              rows={3}
              placeholder="Highlights (one per line)"
              className="w-full rounded-lg border px-4 py-2 text-sm"
            />
          </div>

          {/* EXTRA DETAILS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input name="material" value={form.material} onChange={handleChange} placeholder="Material" className="rounded-lg border px-4 py-2 text-sm" />
            <input name="usage" value={form.usage} onChange={handleChange} placeholder="Usage" className="rounded-lg border px-4 py-2 text-sm" />
            <input name="care" value={form.care} onChange={handleChange} placeholder="Care Instructions" className="rounded-lg border px-4 py-2 text-sm" />
            <input name="warranty" value={form.warranty} onChange={handleChange} placeholder="Warranty" className="rounded-lg border px-4 py-2 text-sm" />
            <input name="expiryDate" value={form.expiryDate} onChange={handleChange} placeholder="Expiry Date" className="rounded-lg border px-4 py-2 text-sm" />
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
                className="mb-2 w-full rounded-lg border px-4 py-2 text-sm"
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

        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
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
