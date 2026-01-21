import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        images: product.images,
      });
    }
  };

  return (
    <div className="product-card">

      {/* 🔥 DISCOUNT BADGE */}
      {product.discount && (
        <span className="discount-badge">
          {product.discount}% OFF
        </span>
      )}

      {/* ❤️ WISHLIST */}
      <button
        className="wishlist-btn"
        onClick={toggleWishlist}
      >
        {isInWishlist(product.id) ? "❤️" : "🤍"}
      </button>

      {/* IMAGE */}
      <Link to={`/product/${product.id}`}>
        <div className="product-card-image">
          <img
            src={product.images[0]}
            alt={product.title}
          />
        </div>
      </Link>

      {/* INFO */}
      <div className="product-card-info">
        <h4 className="product-title">{product.title}</h4>

        {/* PRICE SECTION */}
        <div className="price-box">
          <span className="price-current">
            ₹{product.price}
          </span>

          {product.mrp && (
            <span className="price-mrp">
              ₹{product.mrp}
            </span>
          )}
        </div>

        {/* ADD TO CART */}
        <button
          className="btn full"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
