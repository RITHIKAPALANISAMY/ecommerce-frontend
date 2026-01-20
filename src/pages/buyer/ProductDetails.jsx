import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import "../../styles/productDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setCartItems } = useCart();
  const { products } = useProducts();

  const product = products.find((p) => p.id === Number(id));

  // ✅ SAFETY CHECK
  if (!product) {
    return <h2 style={{ padding: 40 }}>Product not found</h2>;
  }

  // ✅ STATES
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  // ✅ ENSURE REVIEWS UPDATE WHEN PRODUCT CHANGES
  useEffect(() => {
    setReviews(product.reviews || []);
    setQty(1);
    setActiveImg(0);
  }, [product]);

  // ✅ CART HANDLERS
  const handleAddToCart = () => {
    addToCart({ ...product, qty });
  };

  const handleBuyNow = () => {
  setCartItems([
    {
      ...product,
      qty: qty || 1,   // 👈 IMPORTANT
    },
  ]);
  navigate("/cart");   // 👈 NOT checkout directly
};



  // ✅ REVIEW ACTIONS
  const handleLike = (id) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, likes: r.likes + 1 } : r
      )
    );
  };

  const handleDislike = (id) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, dislikes: r.dislikes + 1 } : r
      )
    );
  };

  return (
    <div className="pd-page">
      <div className="pd-container">
        {/* IMAGE GALLERY */}
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

        {/* PRODUCT INFO */}
        <div className="pd-info">
          <p className="brand">{product.brand}</p>
          <h1>{product.title}</h1>

          <div className="rating">
            <span className="badge-green">{product.rating} ★</span>
            <span className="reviews">
              {product.reviewCount} ratings & reviews
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

          {/* ACTION BUTTONS */}
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
            <li>↩️ 7 Days Return & Exchange</li>
            <li>🛡️ 1 Year Warranty</li>
          </ul>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="pd-desc">
        <h3>Product Description</h3>
        <p>{product.description}</p>
      </div>

      {/* REVIEWS */}
      <div className="pd-reviews">
        <h3>Ratings & Reviews</h3>

        <div className="review-summary">
          <span className="avg-rating">{product.rating} ★</span>
          <span className="total-reviews">
            {product.reviewCount} Ratings & Reviews
          </span>
        </div>

        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-top">
              <span className="review-rating">{review.rating} ★</span>
              <span className="review-title">{review.title}</span>
            </div>

            <p className="review-user">
              {review.user} • {review.location}
            </p>
            <p className="review-date">{review.date}</p>

            <div className="review-actions">
              <button onClick={() => handleLike(review.id)}>
                👍 {review.likes}
              </button>
              <button onClick={() => handleDislike(review.id)}>
                👎 {review.dislikes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
