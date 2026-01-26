import { useState, useEffect } from "react";
import { useSellerProducts } from "../../context/SellerProductContext";
import "../../styles/seller/addProduct.css";

export default function SellerEditProduct({ product, onClose }) {
  const { updateSellerProduct } = useSellerProducts();

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
    /* ================= OVERLAY (FIXED) ================= */
    <div className="add-product-overlay">

      {/* ================= MODAL CARD ================= */}
      <div className="add-product-container">
        <h3>Edit Product</h3>

        <div className="add-product-form">
          <h4>Basic Information</h4>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
          />

          <h4>Pricing</h4>
          <input
            name="mrp"
            value={form.mrp}
            onChange={handleChange}
          />

          <input
            name="discount"
            value={form.discount}
            onChange={handleChange}
          />

          <p>Selling Price: ₹{calculatePrice()}</p>

          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
          />

          <h4>Description</h4>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
          />

          <textarea
            name="highlights"
            value={form.highlights}
            onChange={handleChange}
          />

          <input
            name="material"
            value={form.material}
            onChange={handleChange}
          />

          <input
            name="usage"
            value={form.usage}
            onChange={handleChange}
          />

          <input
            name="care"
            value={form.care}
            onChange={handleChange}
          />

          <input
            name="warranty"
            value={form.warranty}
            onChange={handleChange}
          />

          <input
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
          />

          <h4>Product Images</h4>
          {form.images.map((img, i) => (
            <input
              key={i}
              value={img}
              onChange={(e) =>
                handleImageChange(i, e.target.value)
              }
            />
          ))}

          <button onClick={addImageField}>+ Add Image</button>
        </div>

        {/* FOOTER — SINGLE ONLY */}
        <div className="form-actions">
          <button className="close-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
}
