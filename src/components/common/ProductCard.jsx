import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const { user } = useAuth();

  const role = user?.role; // buyer | seller | admin

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // ✅ Guest wishlist allowed
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

  const handleAddToCart = () => {
    // ❌ Block seller & admin
    if (role === "seller" || role === "admin") return;

    // ✅ Guest + buyer allowed
    addToCart(product);
  };

  const isDisabled = role === "seller" || role === "admin";

  return (
    <div className="product-card">
      {/* DISCOUNT */}
      {product.discount && (
        <span className="discount-badge">
          {product.discount}% OFF
        </span>
      )}

      {/* WISHLIST */}
      <button
        className="wishlist-btn"
        onClick={handleWishlist}
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
        <h4 className="product-title">
          {product.title}
        </h4>

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

        {/* ADD TO CART — GUEST + BUYER */}
        <button
          className="btn full"
          onClick={handleAddToCart}
          disabled={isDisabled}
          title={
            isDisabled
              ? "Seller/Admin cannot purchase products"
              : "Add to Cart"
          }
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
