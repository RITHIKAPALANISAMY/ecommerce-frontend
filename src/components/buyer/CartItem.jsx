import { useCart } from "../../context/CartContext";

export default function CartItem({ item }) {
  const { addQty, reduceQty, removeItem } = useCart();

  return (
    <div className="cart-item-card">
      <div className="cart-img-box">
        <img src={item.image} alt={item.title} />
      </div>

      <div className="cart-item-info">
        <h4>{item.title}</h4>
        <p className="brand">SmartHome · Electronics</p>

        <div className="qty-row">
          <button onClick={() => reduceQty(item.id)}>-</button>
          <span>{item.qty}</span>
          <button onClick={() => addQty(item.id)}>+</button>
        </div>
      </div>

      <div className="cart-price">
        <p className="price">₹{item.price * item.qty}</p>
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
