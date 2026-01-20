import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-card-image">
          <img
            src={product.images[0]}
            alt={product.title}
          />
        </div>
      </Link>

      <div className="product-card-info">
        <h4>{product.title}</h4>
        <p className="price">₹{product.price}</p>

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
