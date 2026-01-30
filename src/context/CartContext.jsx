import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  /* ✅ ADD TO CART – FINAL, SAFE VERSION */
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      const stock = product.stock ?? Infinity;
      const qtyToAdd = Number(product.qty) || 1;

      // 🔑 IMAGE NORMALIZATION (CORE FIX)
      const resolvedImage =
        product.image ||
        product.images?.[0] ||
        null;

      if (existing) {
        if (existing.qty >= stock) return prev;

        return prev.map((i) =>
          i.id === product.id
            ? {
                ...i,
                qty: Math.min(i.qty + qtyToAdd, stock),
              }
            : i
        );
      }

      return [
        ...prev,
        {
          ...product,
          image: resolvedImage, // ✅ ALWAYS SAVE IMAGE HERE
          qty: Math.min(qtyToAdd, stock),
        },
      ];
    });
  };

  const addQty = (id) =>
    setCartItems((items) =>
      items.map((i) =>
        i.id === id ? { ...i, qty: i.qty + 1 } : i
      )
    );

  const reduceQty = (id) =>
    setCartItems((items) =>
      items.map((i) =>
        i.id === id && i.qty > 1
          ? { ...i, qty: i.qty - 1 }
          : i
      )
    );

  const removeItem = (id) =>
    setCartItems((items) =>
      items.filter((i) => i.id !== id)
    );

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    setAppliedCoupon(null);
  };

  const applyCoupon = (code, subtotal) => {
    if (code === "WELCOME10") {
      if (subtotal < 500) return "Minimum ₹500 required";
      setAppliedCoupon({ type: "PERCENT", value: 10 });
      return null;
    }

    if (code === "SAVE500") {
      if (subtotal < 2000) return "Minimum ₹2000 required";
      setAppliedCoupon({ type: "FLAT", value: 500 });
      return null;
    }

    return "Invalid coupon code";
  };

  const removeCoupon = () => setAppliedCoupon(null);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addQty,
        reduceQty,
        removeItem,
        clearCart,
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
