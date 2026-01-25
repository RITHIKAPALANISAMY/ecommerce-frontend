import { useCart } from "../../context/CartContext";

const LOW_STOCK_LIMIT = 5;

export default function CartItem({ item }) {
  const { addQty, reduceQty, removeItem } = useCart();

  // ✅ SAFETY
  const qty = Number(item.qty) || 1;
  const price = Number(item.price) || 0;
  const stock =
    item.stock !== undefined ? Number(item.stock) : null;

  const isOutOfStock = stock === 0;
  const isLowStock =
    stock !== null && stock > 0 && stock <= LOW_STOCK_LIMIT;

  // 🔔 NOTIFY HANDLER
  const handleNotify = () => {
    const notifyList =
      JSON.parse(localStorage.getItem("notifyList")) || [];

    const alreadyAdded = notifyList.some(
      (n) => n.productId === item.id
    );

    if (!alreadyAdded) {
      notifyList.push({
        productId: item.id,
        title: item.title,
        date: new Date().toISOString(),
      });

      localStorage.setItem(
        "notifyList",
        JSON.stringify(notifyList)
      );

      alert(
        "You’ll be notified when this product is back in stock."
      );
    }
  };

  return (
    <div
      className={`cart-item-card ${
        isOutOfStock ? "out-stock-card" : ""
      }`}
    >
      {/* IMAGE */}
      <div className="cart-img-box">
        <img
          src={item.image || item.images?.[0]}
          alt={item.title}
        />
      </div>

      {/* INFO */}
      <div className="cart-item-info">
        <h4>{item.title}</h4>
        <p className="brand">SmartHome · Electronics</p>

        {/* 🔴 OUT OF STOCK */}
        {isOutOfStock && (
          <p className="stock-label out">Out of stock</p>
        )}

        {/* 🟠 LOW STOCK */}
        {isLowStock && (
          <p className="stock-label low">
            Only {stock} left
          </p>
        )}

        {/* 🔢 QUANTITY (DISABLED FOR OOS) */}
        {!isOutOfStock && (
          <div className="qty-row">
            <button
              onClick={() => reduceQty(item.id)}
              disabled={qty <= 1}
            >
              −
            </button>

            <span>{qty}</span>

            <button
              onClick={() => addQty(item.id)}
              disabled={stock !== null && qty >= stock}
            >
              +
            </button>
          </div>
        )}

        {/* 🔔 NOTIFY */}
        {isOutOfStock && (
          <div className="notify-wrapper">
            <button
              className="notify-btn"
              onClick={handleNotify}
            >
              🔔 Notify me when available
            </button>
          </div>
        )}
      </div>

      {/* PRICE */}
      <div className="cart-price">
        {!isOutOfStock && (
          <p className="price">₹{price * qty}</p>
        )}

        <button
          className="remove"
          onClick={() => removeItem(item.id)}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
