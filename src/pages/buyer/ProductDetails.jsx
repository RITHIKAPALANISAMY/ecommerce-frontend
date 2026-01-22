import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import "../../styles/productDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products } = useProducts();
  const { addToCart, setCartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <h2 style={{ padding: 40 }}>Product not found</h2>;
  }

  /* ---------------- STATES ---------------- */
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const reviews = product.reviews || [];

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  /* ---------------- HANDLERS ---------------- */
  const handleAddToCart = () => {
    addToCart({ ...product, qty });
  };

  const handleBuyNow = () => {
    setCartItems([{ ...product, qty }]);
    navigate("/cart");
  };

  const toggleWishlist = () => {
    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="pd-page">
      <div className="pd-container">

        {/* ================= IMAGES ================= */}
        <div className="pd-images">
          <img
            className="pd-main-img"
            src={product.images[activeImg]}
            alt={product.title}
          />

          <div className="pd-thumbs">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={i === activeImg ? "active" : ""}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
        </div>

        {/* ================= INFO ================= */}
        <div className="pd-info">
          <p className="brand">{product.brand}</p>

          <div className="pd-title-row">
            <h1 className="pd-title">{product.title}</h1>

            <button
              className={`pd-wishlist-btn ${
                isInWishlist(product.id) ? "active" : ""
              }`}
              onClick={toggleWishlist}
            >
              {isInWishlist(product.id) ? "❤️ Wishlisted" : "🤍 Wishlist"}
            </button>
          </div>

          <div className="rating">
            <span className="badge-green">
              {averageRating || "New"} ★
            </span>
            <span className="reviews">
              {reviews.length} ratings & reviews
            </span>
          </div>

          <div className="price">
            <span className="current">₹{product.price}</span>
            <span className="old">₹{product.mrp}</span>
            <span className="off">{product.discount}% off</span>
          </div>

          <p className="tax">Inclusive of all taxes</p>

          {/* QUANTITY */}
          <div className="qty">
            <span>Quantity</span>
            <div className="qty-box">
              <button onClick={() => qty > 1 && setQty(qty - 1)}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
              <span className="stock">
                ({product.stock} available)
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pd-actions">
            <button className="btn-cart" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>
            <button className="btn-buy" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          <ul className="highlights">
            <li>🚚 Free Delivery</li>
            <li>↩️ 7 Days Return</li>
            <li>🛡️ Genuine Product</li>
          </ul>
        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="pd-desc">
        <h3>About this product</h3>
        <p>{product.description?.about}</p>

        <h4>Highlights</h4>
        <ul>
          {product.description?.highlights?.map((h, i) => (
            <li key={i}>✔ {h}</li>
          ))}
        </ul>

        <div className="pd-specs">
          <p><strong>Material:</strong> {product.description?.material}</p>
          <p><strong>Usage:</strong> {product.description?.usage}</p>
          <p><strong>Care:</strong> {product.description?.care}</p>
          <p><strong>Warranty:</strong> {product.description?.warranty}</p>
        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <div className="pd-reviews">
        <h3>Ratings & Reviews</h3>

        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((r) => (
          <div key={r.id} className="review-card">
            <span className="review-rating">{r.rating} ★</span>
            <strong>{r.title}</strong>
            <p>{r.comment || "Customer feedback"}</p>
            <small>
              {r.user} • {r.date}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
