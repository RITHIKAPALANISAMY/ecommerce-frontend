import { useState, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import axios from "axios";
import { toast } from "react-toastify";

const CATEGORY_API = "http://localhost:8082/api/categories";

export default function SellerEditProduct({ product, onClose }) {
  const { updateProduct } = useProducts();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchCategories();
    return () => (document.body.style.overflow = "auto");
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API);
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (index, value) => {
    const updated = [...form.images];
    updated[index] = value;
    setForm({ ...form, images: updated });
  };

  const addImageField = () =>
    setForm({ ...form, images: [...form.images, ""] });

  const calculatePrice = () => {
    const mrp = Number(form.mrp);
    const discount = Number(form.discount);
    if (!mrp) return 0;
    return Math.round(mrp - (mrp * discount) / 100);
  };

  const handleSave = async () => {
    if (!form.title || !form.categoryId || !form.mrp || !form.stock) {
      toast.warning("Please fill all required fields");
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

      toast.success("Product updated successfully");
      onClose();

    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

        <h3 className="mb-4 text-xl font-semibold">Edit Product</h3>

        <div className="space-y-6">

          <div>
            <h4 className="mb-2 font-medium">Basic Information</h4>

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
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Pricing</h4>

            <div className="grid gap-3 sm:grid-cols-2">
              <input name="mrp" value={form.mrp} onChange={handleChange} className="rounded-lg border px-4 py-2 text-sm" />
              <input name="discount" value={form.discount} onChange={handleChange} className="rounded-lg border px-4 py-2 text-sm" />
            </div>

            <p className="mt-2 text-sm">
              Selling Price: <strong>₹{calculatePrice()}</strong>
            </p>

            <input name="stock" value={form.stock} onChange={handleChange} className="mt-2 w-full rounded-lg border px-4 py-2 text-sm" />
          </div>

          <div>
            <h4 className="mb-2 font-medium">Product Images</h4>

            {form.images.map((img, i) => (
              <input
                key={i}
                value={img}
                onChange={(e) => handleImageChange(i, e.target.value)}
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

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm text-white"
          >
            Update Product
          </button>
        </div>

      </div>
    </div>
  );
}