import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";

const SellerProductContext = createContext();

export function SellerProductProvider({ children }) {
  const { user } = useAuth();

 
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  
  useEffect(() => {
    const syncOrders = () => {
      const latest =
        JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(latest);
    };

    syncOrders();
    const interval = setInterval(syncOrders, 1000);

    return () => clearInterval(interval);
  }, []);

  
  const addSellerProduct = (product) => {
    if (!user) return;

    const newProduct = {
      ...product,
      id: Date.now(),
      sellerId: user.email,
    };

    setProducts((prev) => [...prev, newProduct]);
  };

  const deleteSellerProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateSellerProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      )
    );
  };


  const sellerProducts = useMemo(() => {
    if (!user) return [];

    return products
      .filter((p) => p.sellerId === user.email)
      .map((product) => {
        let sold = 0;
        let revenue = 0;

        orders.forEach((order) => {
          order.items?.forEach((item) => {
            
            const orderedProductId =
              item.productId ?? item.id;

            if (orderedProductId === product.id) {
              const qty = item.quantity || 1;
              sold += qty;
              revenue += qty * item.price;
            }
          });
        });

        return {
          ...product,
          sold,
          revenue,
        };
      });
  }, [products, orders, user]);

  
  const buyerProducts = products;

  
  const hasSufficientStock = (items) => {
    return items.every((item) => {
      const product = products.find(
        (p) =>
          p.id === (item.productId ?? item.id)
      );
      if (!product) return true;
      return product.stock >= item.quantity;
    });
  };

  
  const reduceStockAfterOrder = (items) => {
    setProducts((prev) =>
      prev.map((product) => {
        const orderedItem = items.find(
          (i) =>
            (i.productId ?? i.id) === product.id
        );
        if (!orderedItem) return product;

        return {
          ...product,
          stock:
            product.stock -
            (orderedItem.quantity || 1),
        };
      })
    );
  };

  
  const restoreStockAfterCancel = (items) => {
    setProducts((prev) =>
      prev.map((product) => {
        const cancelledItem = items.find(
          (i) =>
            (i.productId ?? i.id) === product.id
        );
        if (!cancelledItem) return product;

        return {
          ...product,
          stock:
            product.stock +
            (cancelledItem.quantity || 1),
        };
      })
    );
  };

  return (
    <SellerProductContext.Provider
      value={{
        products: buyerProducts,
        sellerProducts,
        addSellerProduct,
        deleteSellerProduct,
        updateSellerProduct,
        hasSufficientStock,
        reduceStockAfterOrder,
        restoreStockAfterCancel,
      }}
    >
      {children}
    </SellerProductContext.Provider>
  );
}

export const useSellerProducts = () =>
  useContext(SellerProductContext);
