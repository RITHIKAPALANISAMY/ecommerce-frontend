import { useEffect, useState } from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();

  const [wishlistProducts, setWishlistProducts] = useState([]);

  const isBuyer = user?.role === "BUYER";

  /* ================= MATCH WISHLIST WITH PRODUCTS ================= */

  useEffect(() => {
    if (!wishlist.length || !products.length) {
      setWishlistProducts([]);
      return;
    }

    const matchedProducts = wishlist
      .map(item =>
        products.find(p => p.id === item.productId)
      )
      .filter(Boolean);

    setWishlistProducts(matchedProducts);
  }, [wishlist, products]);

  if (!user) {
    navigate("/login");
    return null;
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">
          <div className="mb-4 text-5xl">🤍</div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Your Wishlist is Empty
          </h2>
          <p className="mt-2 text-gray-500">
            Browse products and save your favorites here.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            My Wishlist
          </h2>
          <span className="text-sm text-gray-500">
            {wishlistProducts.length} item
            {wishlistProducts.length > 1 && "s"}
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
            >
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="flex h-56 cursor-pointer items-center justify-center rounded-t-2xl bg-gray-100"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain transition group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <h4 className="line-clamp-2 text-sm font-medium text-gray-800">
                  {product.title}
                </h4>

                <p className="mt-2 text-lg font-bold text-red-600">
                  ₹{product.price}
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  {isBuyer && (
                    <button
                      onClick={() => {
                        addToCart(product);
                        removeFromWishlist(product.id);
                      }}
                      className="w-full rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Move to Cart
                    </button>
                  )}

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-full rounded-lg border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
