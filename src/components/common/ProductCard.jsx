import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCompare } from "../../context/CompareContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();
  const { compareItems, addToCompare, removeFromCompare } =
    useCompare();

  const productImage = product.images?.[0];
  const isCompared = compareItems.some(
    (item) => item.id === product.id
  );

  return (
    <div className="group flex h-full flex-col rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* IMAGE SECTION */}
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative flex h-56 w-full cursor-pointer items-center justify-center overflow-hidden rounded-t-2xl bg-gray-100"
      >
        {productImage ? (
          <img
            src={productImage}
            alt={product.title}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="text-sm text-gray-400">No Image</div>
        )}

        {/* WISHLIST BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isInWishlist(product.id)
              ? removeFromWishlist(product.id)
              : addToWishlist(product);
          }}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-md backdrop-blur transition hover:scale-110"
        >
          {isInWishlist(product.id) ? "❤️" : "🤍"}
        </button>

        {/* DISCOUNT BADGE */}
        {product.discount && (
          <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {product.brand}
          </p>
        )}

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-800">
          {product.title}
        </h3>

        {/* PRICE */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-red-600">
            ₹{product.price}
          </span>
          {product.mrp && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.mrp}
            </span>
          )}
        </div>

        {/* ADD TO CART */}
        <div className="mt-auto pt-4">
          <button
            onClick={() =>
              addToCart({
                ...product,
                image: productImage,
                qty: 1,
              })
            }
            className="w-full rounded-xl bg-red-600 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 hover:shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
