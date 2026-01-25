import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSellerProducts } from "../../context/SellerProductContext";
import "../../styles/seller/addProduct.css";

export default function SellerAddProduct({ onClose }) {
  const { user } = useAuth();
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

  const handleSave = () => {
    if (!form.title || !form.category || !form.mrp || !form.stock) {
      alert("Please fill all required fields");
      return;
    }

    addSellerProduct({
      id: Date.now(),
      title: form.title,
      category: form.category,
      mrp: Number(form.mrp),
      discount: Number(form.discount) || 0,
      price: calculatePrice(),
      stock: Number(form.stock),
      images: form.images.filter(Boolean),
      sellerId: user.email,
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
    });

    onClose();
  };

  return (
    /* ================= OVERLAY (FIXED) ================= */
    <div className="add-product-overlay">

      {/* ================= MODAL CARD ================= */}
      <div className="add-product-container">
        <h3>Add New Product</h3>

        <div className="add-product-form">
          <h4>Basic Information</h4>
          <input
            name="title"
            placeholder="Product Name *"
            onChange={handleChange}
          />

          <select name="category" onChange={handleChange}>
            <option value="">Select Category *</option>
            <option>Mobiles</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Beauty</option>
            <option>Grocery</option>
            <option>Home</option>
          </select>

          <h4>Pricing</h4>
          <input name="mrp" placeholder="MRP *" onChange={handleChange} />
          <input
            name="discount"
            placeholder="Discount (%)"
            onChange={handleChange}
          />

          <p>Selling Price: ₹{calculatePrice()}</p>

          <input
            name="stock"
            placeholder="Stock *"
            onChange={handleChange}
          />

          <h4>Description</h4>
          <textarea
            name="about"
            placeholder="About this product"
            onChange={handleChange}
          />

          <textarea
            name="highlights"
            placeholder="Highlights (one per line)"
            onChange={handleChange}
          />

          <input
            name="material"
            placeholder="Material (if applicable)"
            onChange={handleChange}
          />

          <input
            name="usage"
            placeholder="Usage"
            onChange={handleChange}
          />

          <input
            name="care"
            placeholder="Care Instructions"
            onChange={handleChange}
          />

          <input
            name="warranty"
            placeholder="Warranty (if applicable)"
            onChange={handleChange}
          />

          <input
            name="expiryDate"
            placeholder="Expiry Date (for food/grocery)"
            onChange={handleChange}
          />

          <h4>Product Images</h4>
          {form.images.map((img, i) => (
            <input
              key={i}
              placeholder="Image URL"
              value={img}
              onChange={(e) =>
                handleImageChange(i, e.target.value)
              }
            />
          ))}

          <button onClick={addImageField}>+ Add Image</button>
        </div>

        {/* FOOTER — SINGLE, CLEAN */}
        <div className="form-actions">
          <button className="close-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
