import { useState } from "react";
import { useSellerProducts } from "../../context/SellerProductContext";

export default function SellerEditProduct({ product, onClose }) {
  const { updateSellerProduct } = useSellerProducts();

  const [form, setForm] = useState({
    title: product.title,
    category: product.category,
    image: product.images?.[0] || "",
    price: product.price,
    stock: product.stock,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateSellerProduct({
      ...product,
      title: form.title,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      images: [form.image],
    });

    onClose();
  };

  return (
    <div className="add-product-container">
      <h3>Edit Product</h3>

      <div className="add-product-form">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Name"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
        />
      </div>

      <div className="form-actions">
        <button className="save-btn" onClick={handleSave}>
          Update Product
        </button>
      </div>
    </div>
  );
}
