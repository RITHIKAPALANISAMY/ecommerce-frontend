import { useCart } from "../../context/CartContext";

const LOW_STOCK_LIMIT = 5;

export default function CartItem({ item }) {
  const { addQty, reduceQty, removeItem } = useCart();

 
  const quantity = Number(item.quantity) || 1;
  const price = Number(item.price) || 0;

 
  const imageSrc =
    item.image ||
    item.images?.[0] ||
    "";

  const stock =
    item.stock !== undefined ? Number(item.stock) : null;

  const isOutOfStock = stock === 0;
  const isLowStock =
    stock !== null && stock > 0 && stock <= LOW_STOCK_LIMIT;

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 rounded-2xl bg-white p-4 shadow-sm border
        ${isOutOfStock ? "opacity-70" : ""}`}
    >
      <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-xs text-gray-400">
            No Image
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <h4 className="font-semibold text-gray-800">
          {item.title}
        </h4>

        <p className="text-sm text-gray-500">
          {item.brand} · {item.category}
        </p>

        {isOutOfStock && (
          <p className="mt-1 text-sm font-medium text-red-600">
            Out of stock
          </p>
        )}

        {isLowStock && (
          <p className="mt-1 text-sm font-medium text-orange-600">
            Only {stock} left
          </p>
        )}

        {!isOutOfStock && (
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => reduceQty(item.id)}
              disabled={quantity <= 1}
              className="h-8 w-8 rounded-full border text-lg disabled:opacity-40"
            >
              −
            </button>

            <span className="min-w-[24px] text-center font-medium">
              {quantity}
            </span>

            <button
              onClick={() => addQty(item.id)}
              disabled={stock !== null && quantity >= stock}
              className="h-8 w-8 rounded-full border text-lg disabled:opacity-40"
            >
              +
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
        {!isOutOfStock && (
          <p className="text-lg font-bold text-gray-900">
            ₹{price * quantity}
          </p>
        )}

        <button
          onClick={() => removeItem(item.id)}
          className="text-red-600 hover:text-red-700 text-lg"
          title="Remove item"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
