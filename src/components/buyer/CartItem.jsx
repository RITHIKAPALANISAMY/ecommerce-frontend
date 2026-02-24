import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { Trash2 } from "lucide-react";

export default function CartItem({ item }) {
  const { addQty, reduceQty, removeItem } = useCart();

  const quantity = Number(item.quantity) || 1;
  const price = Number(item.price) || 0;
  const stock = Number(item.stock) || 0;

  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col sm:flex-row gap-5 rounded-2xl bg-white/70 backdrop-blur-lg p-5 shadow-lg border border-gray-200 ${
        isOutOfStock ? "opacity-60" : ""
      }`}
    >
      {/* IMAGE */}
      <div className="h-28 w-28 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
        {item.image ? (
          <motion.img
            src={item.image}
            alt={item.productName}
            className="h-full w-full object-contain"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <span className="text-xs text-gray-400">No Image</span>
        )}
      </div>

      {/* DETAILS */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">
            {item.productName}
          </h4>

          {isOutOfStock && (
            <p className="text-sm text-red-600 mt-1">
              Out of stock
            </p>
          )}

          {isLowStock && !isOutOfStock && (
            <p className="text-sm text-orange-500 mt-1">
              Only {stock} left
            </p>
          )}
        </div>

        {!isOutOfStock && (
          <div className="flex items-center gap-4 mt-4">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => reduceQty(item.id, quantity)}
              disabled={quantity <= 1}
              className="h-9 w-9 rounded-full bg-gray-200 hover:bg-gray-300 text-lg disabled:opacity-40"
            >
              −
            </motion.button>

            <span className="text-lg font-medium">
              {quantity}
            </span>

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => addQty(item.id, quantity)}
              disabled={quantity >= stock}
              className="h-9 w-9 rounded-full bg-gray-200 hover:bg-gray-300 text-lg disabled:opacity-40"
            >
              +
            </motion.button>
          </div>
        )}
      </div>

      {/* PRICE + DELETE */}
      <div className="flex flex-col items-end justify-between">
        <motion.p
          key={price * quantity}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-xl font-bold text-gray-900"
        >
          ₹{price * quantity}
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => removeItem(item.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
}