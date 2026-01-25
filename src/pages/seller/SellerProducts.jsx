import { useAuth } from "../../context/AuthContext";
import { useSellerProducts } from "../../context/SellerProductContext";
import SellerProductCard from "../../components/seller/SellerProductCard";

export default function SellerProducts() {
  const { user } = useAuth();
  const { sellerProducts } = useSellerProducts();

  const myProducts = sellerProducts.filter(
    (p) => p.sellerId === user.email
  );

  const LOW_STOCK_LIMIT = 5;

  const lowStockCount = myProducts.filter(
    (p) => p.stock > 0 && p.stock <= LOW_STOCK_LIMIT
  ).length;

  const outOfStockCount = myProducts.filter(
    (p) => p.stock === 0
  ).length;

  return (
    <div className="seller-products">
      <div className="products-header">
        <h3>My Products</h3>
        <p>{myProducts.length} products</p>
      </div>

      {/* ✅ SINGLE COMPACT INVENTORY ALERT */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="stock-alert compact">
          ⚠️ <strong>Inventory Alert:</strong>{" "}
          {lowStockCount > 0 && (
            <span>{lowStockCount} low stock</span>
          )}
          {lowStockCount > 0 && outOfStockCount > 0 && " · "}
          {outOfStockCount > 0 && (
            <span>{outOfStockCount} out of stock</span>
          )}
        </div>
      )}

      {myProducts.length === 0 ? (
        <p className="empty">No products added yet.</p>
      ) : (
        <div className="seller-product-grid">
          {myProducts.map((product) => (
            <SellerProductCard
  key={product.id}
  product={product}
  lowStock={product.stock > 0 && product.stock <= LOW_STOCK_LIMIT}
  outOfStock={product.stock === 0}
/>

          ))}
        </div>
      )}
    </div>
  );
}
