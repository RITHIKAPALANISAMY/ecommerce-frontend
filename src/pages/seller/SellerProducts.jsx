import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSellerProducts } from "../../context/SellerProductContext";
import { useOrders } from "../../context/OrderContext";
import SellerProductCard from "../../components/seller/SellerProductCard";
import SellerAddProduct from "../../pages/seller/SellerAddProduct";
import "../../styles/seller/sellerProducts.css";

export default function SellerProducts() {
  const { user } = useAuth();
  const { sellerProducts } = useSellerProducts();
  const { orders } = useOrders();

  const [showAddProduct, setShowAddProduct] = useState(false);

  const sellerId = user.email;
  const LOW_STOCK_LIMIT = 5;

  const myProducts = sellerProducts.filter(
    (p) => p.sellerId === sellerId
  );

  const productStats = useMemo(() => {
    return myProducts.map((product) => {
      const sold = orders
        .flatMap((o) => o.items)
        .filter(
          (i) =>
            i.productId === product.id &&
            i.sellerId === sellerId &&
            i.status !== "Cancelled"
        )
        .reduce((s, i) => s + i.quantity, 0);

      return {
        ...product,
        sold,
        revenue: sold * product.price,
      };
    });
  }, [myProducts, orders, sellerId]);

  return (
    <div className="seller-products">

      {/* HEADER */}
      <div className="products-header">
        <div>
          <h3>My Products</h3>
          <p className="product-count">
            {productStats.length} product
            {productStats.length !== 1 && "s"}
          </p>
        </div>

        <button
  className="add-product-btn dashboard-style"
  onClick={() => setShowAddProduct(true)}
>
  + Add Product
</button>

      </div>

      {/* PRODUCT GRID */}
      {productStats.length === 0 ? (
        <p className="empty">No products added yet.</p>
      ) : (
        <div 
        className="seller-product-grid">
          {productStats.map((product) => (
            <SellerProductCard
              key={product.id}
              product={product}
              lowStock={
                product.stock > 0 &&
                product.stock <= LOW_STOCK_LIMIT
              }
              outOfStock={product.stock === 0}
            />
          ))}
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProduct && (
        <SellerAddProduct
          onClose={() => setShowAddProduct(false)}
        />
      )}
    </div>
  );
}
