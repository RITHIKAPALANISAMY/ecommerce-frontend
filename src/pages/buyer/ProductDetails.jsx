import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
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
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();
  const { user } = useAuth();

  /* ✅ SCROLL TO TOP */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const product = products.find(
    (p) => p.id === Number(id)
  );

  if (!product) {
    return <h2 style={{ padding: 40 }}>Product not found</h2>;
  }

  /* ================= STOCK ================= */
  const LOW_STOCK_LIMIT = 5;
  const stock = product.stock ?? null;

  const stockStatus =
    stock === 0
      ? "OUT"
      : stock <= LOW_STOCK_LIMIT
      ? "LOW"
      : "IN";

  /* ================= STATE ================= */
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const reviews = product.reviews || [];

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    return (
      reviews.reduce((s, r) => s + r.rating, 0) /
      reviews.length
    ).toFixed(1);
  }, [reviews]);

  /* ================= DESCRIPTION ================= */
  const desc = product.description || {};

  const hasAbout =
    desc.about && desc.about.trim().length > 0;

  const hasHighlights =
    Array.isArray(desc.highlights) &&
    desc.highlights.length > 0;

  const specs = [
    { label: "Material", value: desc.material },
    { label: "Usage", value: desc.usage },
    { label: "Care Instructions", value: desc.care },
    { label: "Warranty", value: desc.warranty },
    { label: "Expiry Date", value: desc.expiryDate },
  ].filter(
    (s) =>
      s.value &&
      String(s.value).trim() !== ""
  );

  /* ================= HANDLERS ================= */
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

  /* ================= UI ================= */
  return (
    <div className="pd-page">
      <div className="pd-container">
        {/* IMAGES */}
        <div className="pd-images">
          <img
            className="pd-main-img"
            src={product.images?.[activeImg]}
            alt={product.title}
          />

          <div className="pd-thumbs">
            {product.images?.map((img, i) => (
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

        {/* INFO */}
        <div className="pd-info">
          {product.brand && (
            <p className="brand">{product.brand}</p>
          )}

          <div className="pd-title-row">
            <h1 className="pd-title">{product.title}</h1>

            <button
              className={`pd-wishlist-btn ${
                isInWishlist(product.id) ? "active" : ""
              }`}
              onClick={toggleWishlist}
            >
              {isInWishlist(product.id)
                ? "❤️ Wishlisted"
                : "🤍 Wishlist"}
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
            {product.mrp && (
              <span className="old">₹{product.mrp}</span>
            )}
            {product.discount && (
              <span className="off">
                {product.discount}% off
              </span>
            )}
          </div>

          <p className="tax">Inclusive of all taxes</p>

          {/* QUANTITY */}
          <div className="qty">
            <span>Quantity</span>

            <div className="qty-box">
              <button onClick={() => qty > 1 && setQty(qty - 1)}>
                −
              </button>

              <span>{qty}</span>

              <button
                onClick={() =>
                  stock !== null &&
                  qty < stock &&
                  setQty(qty + 1)
                }
                disabled={stock === 0}
              >
                +
              </button>

              {stock !== null && (
                <span
                  className={`stock ${
                    stockStatus === "OUT"
                      ? "out"
                      : stockStatus === "LOW"
                      ? "low"
                      : "in"
                  }`}
                >
                  {stockStatus === "OUT" && "Out of stock"}
                  {stockStatus === "LOW" &&
                    `Only ${stock} left`}
                </span>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pd-actions">
            <button
              className={`btn-cart ${
                stockStatus === "OUT" ? "disabled" : ""
              }`}
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>

            <button
              className="btn-buy"
              onClick={handleBuyNow}
              disabled={stock === 0}
            >
              Buy Now
            </button>
          </div>

          {stockStatus === "OUT" && (
            <button className="btn-notify">
              🔔 Notify me when available
            </button>
          )}

          <ul className="highlights">
            <li>🚚 Free Delivery</li>
            <li>↩️ 7 Days Return</li>
            <li>🛡️ Genuine Product</li>
          </ul>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="pd-desc">
        <h3>About this product</h3>

        {hasAbout ? (
          <p>{desc.about}</p>
        ) : (
          <p className="muted">
            Detailed product information will be provided by the seller soon.
          </p>
        )}

        {hasHighlights && (
          <>
            <h4>Highlights</h4>
            <ul>
              {desc.highlights.map((h, i) => (
                <li key={i}>✔ {h}</li>
              ))}
            </ul>
          </>
        )}

        {specs.length > 0 && (
          <>
            <h4>Specifications</h4>
            <div className="pd-specs">
              {specs.map((s, i) => (
                <p key={i}>
                  <strong>{s.label}:</strong> {s.value}
                </p>
              ))}
            </div>
          </>
        )}
      </div>

      {/* REVIEWS */}
      <div className="pd-reviews">
        <h3>Ratings & Reviews</h3>

        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((r) => (
          <div key={r.id} className="review-card">
            <span className="review-rating">{r.rating} ★</span>
            <strong>{r.user}</strong>
            <p>{r.comment}</p>
            <small>{r.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
