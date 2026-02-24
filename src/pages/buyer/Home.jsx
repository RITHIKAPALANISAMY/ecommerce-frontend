import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Laptop,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  ShoppingCart,
  Leaf,
} from "lucide-react";
import ProductCard from "../../components/common/ProductCard";
import { useProducts } from "../../context/ProductContext";

const CATEGORY_API = "http://localhost:8082/api/categories";

/* ---------------- ICON MAPPING ---------------- */

const iconMap = {
  Mobiles: Smartphone,
  Electronics: Laptop,
  Fashion: Shirt,
  Home: HomeIcon,
  Beauty: Sparkles,
  Grocery: ShoppingCart,
  "Eco-Friendly": Leaf,
};

/* ---------------- HERO SLIDER ---------------- */

function HeroSlider() {
  const total = 3;
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  const slides = [
    {
      title: "Big Fashion Sale",
      subtitle: "Up to 50% Off on Top Brands",
      image:
        "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1600&q=80",
      btn: "Shop Now",
    },
    {
      title: "Electronics Bonanza",
      subtitle: "Best Deals on Gadgets",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475",
      btn: "Explore",
    },
    {
      title: "Home Essentials",
      subtitle: "Upgrade Your Living Space",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      btn: "Buy Now",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={i} className="relative min-w-full h-[260px] sm:h-[360px]">
            <img
              src={s.image}
              alt={s.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
            <div className="relative z-10 flex h-full items-center px-6 sm:px-12">
              <div className="max-w-lg">
                <h2 className="text-2xl sm:text-4xl font-bold text-white">
                  {s.title}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-white/90">
                  {s.subtitle}
                </p>
                <button className="mt-6 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-700">
                  {s.btn}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

/* ---------------- HOME PAGE ---------------- */

export default function Home() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  return (
    <div className="bg-gray-50 pb-12">

      <div className="px-3 sm:px-4 pt-4">
        <HeroSlider />
      </div>

      <div className="mt-10 px-3 sm:px-4">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Shop by Category
        </h3>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {categories.map((c) => {
            const Icon = iconMap[c.name] || ShoppingCart;

            return (
              <div
                key={c.id}
                onClick={() => navigate(`/category/${c.id}`)}  // ✅ FIXED HERE
                className={`group cursor-pointer rounded-2xl p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                  c.name === "Eco-Friendly"
                    ? "bg-green-100 border border-green-300"
                    : "bg-white"
                }`}
              >
                <Icon
                  size={28}
                  className={`mx-auto ${
                    c.name === "Eco-Friendly"
                      ? "text-green-600"
                      : "text-gray-600 group-hover:text-red-600"
                  }`}
                />
                <p className="mt-2 text-sm font-medium text-gray-700">
                  {c.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <section className="mt-12 px-3 sm:px-4">
        <h3 className="mb-5 text-lg font-semibold text-gray-800">
          Top Deals
        </h3>

        {loading && (
          <div className="text-center py-10 text-gray-500">
            Loading products...
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No products available
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}