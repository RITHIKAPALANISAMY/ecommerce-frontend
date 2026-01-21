import { createContext, useContext, useEffect, useState } from "react";

const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem("coupons");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            code: "SHOP10",
            discount: "10%",
            type: "Flat",
            expiry: "2026-01-31",
          },
          {
            id: 2,
            code: "NEWUSER20",
            discount: "20%",
            type: "Percentage",
            expiry: "2026-02-15",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = (coupon) => {
    setCoupons((prev) => [
      ...prev,
      { ...coupon, id: Date.now() },
    ]);
  };

  const updateCoupon = (id, updated) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCoupon = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CouponContext.Provider
      value={{ coupons, addCoupon, updateCoupon, deleteCoupon }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupons = () => useContext(CouponContext);
