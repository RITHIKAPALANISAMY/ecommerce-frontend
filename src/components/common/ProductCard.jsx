import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const isBuyer = user && user.role === "buyer";

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

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
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isBuyer) return;

    addToCart(product);
  };

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

        {/* ADD TO CART — ONLY FOR BUYER */}
        {isBuyer && (
          <button
            className="btn full"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
