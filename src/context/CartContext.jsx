import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // ✅ LOAD CART
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ✅ SAVE CART
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ ADD TO CART (STOCK-SAFE)
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      const stock =
        product.stock !== undefined
          ? Number(product.stock)
          : 0; // 🔴 DEFAULT SAFE

      const qtyToAdd = Number(product.qty) || 1;

      if (existing) {
        // ❌ DO NOT ADD IF OUT OF STOCK
        if (stock === 0) return prev;

        return prev.map((i) =>
          i.id === product.id
            ? {
                ...i,
                qty: Math.min(i.qty + qtyToAdd, stock),
                stock, // ✅ KEEP UPDATED
              }
            : i
        );
      }

      return [
        ...prev,
        {
          ...product,
          image: product.image || product.images?.[0],
          qty: stock === 0 ? 1 : Math.min(qtyToAdd, stock),
          stock, // ✅ CRITICAL FIX
        },
      ];
    });
  };

  // ✅ INCREASE QTY (BLOCK OOS)
  const addQty = (id) => {
    setCartItems((items) =>
      items.map((i) => {
        if (i.id !== id) return i;
        if (i.stock === 0) return i;
        if (i.stock !== null && i.qty >= i.stock) return i;
        return { ...i, qty: i.qty + 1 };
      })
    );
  };

  // ✅ DECREASE QTY
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
