import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isBuyer = user && user.role === "buyer";

  if (!user) {
    navigate("/login");
    return null;
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <h2>Your Wishlist is Empty ❤️</h2>
        <p>Save items you like and view them here.</p>
        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h2>My Wishlist ({wishlist.length})</h2>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div
            className="wishlist-card"
            key={product.id}
          >
            <img
              src={product.images[0]}
              alt={product.title}
            />

            <div className="wishlist-info">
              <h4>{product.title}</h4>
              <p className="wishlist-price">
                ₹{product.price}
              </p>

              <div className="wishlist-actions">
                {/* MOVE TO CART — BUYER ONLY */}
                {isBuyer && (
                  <button
                    className="btn primary"
                    onClick={() => addToCart(product)}
                  >
                    Move to Cart
                  </button>
                )}

                <button
                  className="btn danger"
                  onClick={() =>
                    removeFromWishlist(product.id)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
