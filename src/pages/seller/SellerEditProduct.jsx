import { useState, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import axios from "axios";
import { toast } from "react-toastify";

const CATEGORY_API = "http://localhost:8082/api/categories";

export default function SellerEditProduct({ product, onClose }) {
  const { updateProduct } = useProducts();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchCategories();
    return () => (document.body.style.overflow = "auto");
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API);
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

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

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (index, value) => {
    const updated = [...form.images];
    updated[index] = value;
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const addImageField = () => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const calculatePrice = () => {
    const mrp = Number(form.mrp);
    const discount = Number(form.discount) || 0;

    if (!mrp || mrp <= 0) return 0;

    return Math.round(mrp - (mrp * discount) / 100);
  };

  /* ================= SUBMIT ================= */

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.warning("Product title is required");
      return;
    }

    if (!form.categoryId) {
      toast.warning("Please select a category");
      return;
    }

    if (!form.mrp || !form.stock) {
      toast.warning("MRP and Stock are required");
      return;
    }

    const updatedProduct = {
      title: form.title.trim(),
      brand: form.brand?.trim() || "",
      categoryId: form.categoryId,
      mrp: Number(form.mrp),
      discount: Number(form.discount) || 0,
      price: calculatePrice(),
      stock: Number(form.stock),
      images: form.images.filter((img) => img.trim() !== ""),
      description: {
        about: form.about || "",
        highlights: form.highlights
          ? form.highlights.split("\n").filter(Boolean)
          : [],
        material: form.material || "",
        usage: form.usage || "",
        care: form.care || "",
        warranty: form.warranty || "",
        expiryDate: form.expiryDate || "",
      },
    };

    try {
      setLoading(true);

      await updateProduct(product.id, updatedProduct);

      toast.success("Product updated successfully ✅");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

        <h3 className="mb-6 text-xl font-semibold">
          Edit Product
        </h3>

        <form onSubmit={handleSave} className="space-y-6">

          {/* BASIC INFO */}
          <div>
            <h4 className="mb-2 font-medium">Basic Information</h4>

            <input
              name="title"
              value={form.title}
              placeholder="Product Name *"
              onChange={handleChange}
              className="mb-3 w-full rounded-lg border px-4 py-2"
            />

            <input
              name="brand"
              value={form.brand}
              placeholder="Brand"
              onChange={handleChange}
              className="mb-3 w-full rounded-lg border px-4 py-2"
            />

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2"
            >
              <option value="">Select Category *</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRICING */}
          <div>
            <h4 className="mb-2 font-medium">Pricing</h4>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="number"
                name="mrp"
                value={form.mrp}
                placeholder="MRP *"
                onChange={handleChange}
                className="rounded-lg border px-4 py-2"
              />

              <input
                type="number"
                name="discount"
                value={form.discount}
                placeholder="Discount (%)"
                onChange={handleChange}
                className="rounded-lg border px-4 py-2"
              />
            </div>

            <p className="mt-2 text-sm">
              Selling Price: <strong>₹{calculatePrice()}</strong>
            </p>

            <input
              type="number"
              name="stock"
              value={form.stock}
              placeholder="Stock *"
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border px-4 py-2"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <h4 className="mb-2 font-medium">Description</h4>

            <textarea
              name="about"
              value={form.about}
              placeholder="About this product"
              onChange={handleChange}
              rows={3}
              className="mb-3 w-full rounded-lg border px-4 py-2"
            />

            <textarea
              name="highlights"
              value={form.highlights}
              placeholder="Highlights (one per line)"
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          {/* EXTRA DETAILS */}
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="material"
              value={form.material}
              placeholder="Material"
              onChange={handleChange}
              className="rounded-lg border px-4 py-2"
            />

            <input
              name="usage"
              value={form.usage}
              placeholder="Usage"
              onChange={handleChange}
              className="rounded-lg border px-4 py-2"
            />

            <input
              name="care"
              value={form.care}
              placeholder="Care Instructions"
              onChange={handleChange}
              className="rounded-lg border px-4 py-2"
            />

            <input
              name="warranty"
              value={form.warranty}
              placeholder="Warranty"
              onChange={handleChange}
              className="rounded-lg border px-4 py-2"
            />

            <input
              name="expiryDate"
              value={form.expiryDate}
              placeholder="Expiry Date"
              onChange={handleChange}
              className="rounded-lg border px-4 py-2"
            />
          </div>

          {/* IMAGES */}
          <div>
            <h4 className="mb-2 font-medium">Product Images</h4>

            {form.images.map((img, i) => (
              <input
                key={i}
                value={img}
                placeholder="Image URL"
                onChange={(e) =>
                  handleImageChange(i, e.target.value)
                }
                className="mb-2 w-full rounded-lg border px-4 py-2"
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

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}