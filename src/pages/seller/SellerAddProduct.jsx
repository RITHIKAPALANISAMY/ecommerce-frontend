import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSellerProducts } from "../../context/SellerProductContext";

export default function SellerAddProduct() {
  const { user } = useAuth();
  const { addSellerProduct } = useSellerProducts();

  const [form, setForm] = useState({
    name: "",
    category: "",
    image: "",
    price: "",
    stock: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = () => {
    if (!form.name || !form.price || !form.stock) {
      alert("Please fill all required fields");
      return;
    }

    addSellerProduct({
      id: Date.now(),
      title: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.image ? [form.image] : [],
      sellerId: user.email,
    });

    alert("Product added successfully");

    setForm({
      name: "",
      category: "",
      image: "",
      price: "",
      stock: ""
    });
  };

  return (
    <div className="add-product-container">
      <h3>Add New Product</h3>

      <div className="add-product-form">
        <input
          name="name"
          placeholder="Product Name *"
          value={form.name}
          onChange={handleChange}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
          <option value="Beauty">Beauty</option>
          <option value="Grocery">Grocery</option>
        </select>

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Price *"
          value={form.price}
          onChange={handleChange}
        />

        <input
          name="stock"
          placeholder="Stock *"
          value={form.stock}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button className="save-btn" onClick={handleAddProduct}>
          Save Product
        </button>
      </div>
    </div>
  );
}
