import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // ✅ LOAD CART FROM LOCAL STORAGE
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ✅ SAVE CART TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ ADD TO CART (MERGE QTY)
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);

      if (exists) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, qty: i.qty + (product.qty || 1) }
            : i
        );
      }

      return [...prev, { ...product, qty: product.qty || 1 }];
    });
  };

  // ✅ INCREASE QTY
  const addQty = (id) => {
    setCartItems((items) =>
      items.map((i) =>
        i.id === id ? { ...i, qty: i.qty + 1 } : i
      )
    );
  };

  // ✅ DECREASE QTY (MIN 1)
  const reduceQty = (id) => {
    setCartItems((items) =>
      items.map((i) =>
        i.id === id && i.qty > 1
          ? { ...i, qty: i.qty - 1 }
          : i
      )
    );
  };

  // ✅ REMOVE ITEM
  const removeItem = (id) => {
    setCartItems((items) => items.filter((i) => i.id !== id));
  };

  // ✅ APPLY COUPON
  const applyCoupon = (code, subtotal) => {
    if (code === "WELCOME10") {
      if (subtotal < 500) return "Minimum ₹500 required";
      setAppliedCoupon({ code, type: "PERCENT", value: 10 });
      return null;
    }

    if (code === "SAVE500") {
      if (subtotal < 2000) return "Minimum ₹2000 required";
      setAppliedCoupon({ code, type: "FLAT", value: 500 });
      return null;
    }

    return "Invalid coupon code";
  };

  // ✅ REMOVE COUPON
  const removeCoupon = () => setAppliedCoupon(null);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        addQty,
        reduceQty,
        removeItem,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
