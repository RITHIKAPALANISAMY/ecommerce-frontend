import { useState } from "react";
import { useSellerProducts } from "../../context/SellerProductContext";

export default function SellerEditProduct({ product, onClose }) {
  const { updateSellerProduct } = useSellerProducts();

  const [form, setForm] = useState({
    title: product.title || "",
    category: product.category || "",
    mrp: product.mrp || "",
    discount: product.discount || "",
    stock: product.stock || "",
    images: product.images?.length ? product.images : [""],
  });

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...form.images];
    updatedImages[index] = value;
    setForm({ ...form, images: updatedImages });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ""] });
  };

  const removeImageField = (index) => {
    const updatedImages = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updatedImages });
  };

  const calculatePrice = () => {
    const mrp = Number(form.mrp);
    const discount = Number(form.discount);
    if (!mrp) return 0;
    if (!discount) return mrp;
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
    });

    onClose();
  };

  /* ================= UI ================= */

  return (
    <div className="add-product-container">
      <h3>Edit Product</h3>

      <div className="add-product-form">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Name *"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
        />

        {/* 🔥 PRICING */}
        <input
          name="mrp"
          value={form.mrp}
          onChange={handleChange}
          placeholder="MRP *"
        />

        <input
          name="discount"
          value={form.discount}
          onChange={handleChange}
          placeholder="Discount (%)"
        />

        <p style={{ fontWeight: 600 }}>
          Selling Price: ₹{calculatePrice()}
        </p>

        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock *"
        />

        {/* 🔥 MULTIPLE IMAGES */}
        <div>
          <p><strong>Product Images</strong></p>

          {form.images.map((img, index) => (
            <div key={index} style={{ display: "flex", gap: 8 }}>
              <input
                placeholder="Image URL"
                value={img}
                onChange={(e) =>
                  handleImageChange(index, e.target.value)
                }
              />

              {form.images.length > 1 && (
                <button onClick={() => removeImageField(index)}>
                  ❌
                </button>
              )}
            </div>
          ))}

          <button onClick={addImageField}>
            + Add Another Image
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button className="save-btn" onClick={handleSave}>
          Update Product
        </button>
      </div>
    </div>
  );
}
