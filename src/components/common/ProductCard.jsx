import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();

  // ✅ CORRECT IMAGE USAGE FOR IMPORTED ASSETS
  const productImage = product.images?.[0];

  return (
    <div className="flex h-full flex-col rounded-xl bg-white shadow-sm transition hover:shadow-md">
      {/* IMAGE */}
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative flex h-56 w-full cursor-pointer items-center justify-center overflow-hidden rounded-t-xl bg-gray-100"
      >
        {productImage ? (
          <img
            src={productImage}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-sm text-gray-400">
            No Image
          </div>
        )}

        {/* WISHLIST */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isInWishlist(product.id)
              ? removeFromWishlist(product.id)
              : addToWishlist(product);
          }}
          className="absolute right-2 top-2 rounded-full bg-white p-1 shadow"
        >
          {isInWishlist(product.id) ? "❤️" : "🤍"}
        </button>

        {/* DISCOUNT */}
        {product.discount && (
          <span className="absolute left-2 top-2 rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <p className="text-xs text-gray-500">
            {product.brand}
          </p>
        )}

        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-gray-800">
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
                image: productImage, // 🔑 pass imported image
                qty: 1,
              })
            }
            className="w-full rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
