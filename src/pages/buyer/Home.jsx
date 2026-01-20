import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProductCard from "../../components/common/ProductCard";
import { useProducts } from "../../context/ProductContext";

/* ---------------- HERO SLIDER ---------------- */

function HeroSlider() {
  const total = 3;
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  return (
    <div className="hero-slider">
      <div
        className="slides"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        <div className="slide slide-1">
          <div className="slide-content">
            <h2>Big Fashion Sale</h2>
            <p>Up to 50% Off on Top Brands</p>
            <button className="btn">Shop Now</button>
          </div>
        </div>

        <div className="slide slide-2">
          <div className="slide-content">
            <h2>Electronics Bonanza</h2>
            <p>Best Deals on Gadgets</p>
            <button className="btn">Explore</button>
          </div>
        </div>

        <div className="slide slide-3">
          <div className="slide-content">
            <h2>Home Essentials</h2>
            <p>Upgrade Your Living Space</p>
            <button className="btn">Buy Now</button>
          </div>
        </div>
      </div>

      <button className="nav-btn left" onClick={prev}>❮</button>
      <button className="nav-btn right" onClick={next}>❯</button>
    </div>
  );
}

/* ---------------- CATEGORIES ---------------- */

const categories = [
  { name: "Mobiles", icon: "📱" },
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👗" },
  { name: "Home", icon: "🏠" },
  { name: "Beauty", icon: "💄" },
  { name: "Grocery", icon: "🛒" },
];

/* ---------------- HOME ---------------- */

export default function Home() {
  const navigate = useNavigate();
  const { products } = useProducts();

  return (
    <div className="home">

      {/* HERO */}
      <HeroSlider />

      {/* CATEGORIES */}
      <div className="categories">
        {categories.map((c) => (
          <div
            key={c.name}
            className="category-card"
            onClick={() => navigate(`/category/${c.name}`)} // ✅ NAVIGATION
          >
            <span>{c.icon}</span>
            <p>{c.name}</p>
          </div>
        ))}
      </div>

      {/* PRODUCTS (UNCHANGED HOME CONTENT) */}
      <section className="product-section">
        <div className="section-header">
          <h3>Top Deals</h3>
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

    </div>
  );
}
