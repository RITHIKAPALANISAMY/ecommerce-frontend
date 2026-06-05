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
    <div className="relative w-full overflow-hidden rounded-3xl shadow-xl">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={i} className="relative min-w-full h-[280px] sm:h-[380px]">
            <img
              src={s.image}
              alt={s.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="relative z-10 flex h-full items-center px-8 sm:px-14">
              <div className="max-w-lg">
                <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
                  {s.title}
                </h2>
                <p className="mt-4 text-sm sm:text-base text-white/90">
                  {s.subtitle}
                </p>
                <button className="mt-6 rounded-full bg-red-600 px-7 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-red-700 hover:scale-105 transition">
                  {s.btn}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur p-2 text-white hover:bg-black/60"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={next}
        className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur p-2 text-white hover:bg-black/60"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

/* ---------------- HOME PAGE ---------------- */

export default function Home() {
  const navigate = useNavigate();
  const { products, loading, fetchProducts } = useProducts();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

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
    <div className="bg-gray-50 pb-16">

      {/* HERO */}
      <div className="px-4 pt-6">
        <HeroSlider />
      </div>

      {/* ---------------- CATEGORY SECTION ---------------- */}
      <div className="mt-14 px-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Shop by Category
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-6">
          {categories.map((c) => {
            const Icon = iconMap[c.name] || ShoppingCart;

            return (
              <div
                key={c.id}
                onClick={() => navigate(`/category/${c.id}`)}
                className={`group cursor-pointer rounded-2xl p-5 text-center 
                  shadow-md transition-all duration-300 
                  hover:-translate-y-1 hover:shadow-xl 
                  ${
                    c.name === "Eco-Friendly"
                      ? "bg-green-50 border border-green-200"
                      : "bg-white"
                  }`}
              >
                <div className="flex justify-center mb-3">
                  <div
                    className={`p-3 rounded-xl transition ${
                      c.name === "Eco-Friendly"
                        ? "bg-green-100"
                        : "bg-gray-100 group-hover:bg-red-100"
                    }`}
                  >
                    <Icon
                      size={24}
                      className={`${
                        c.name === "Eco-Friendly"
                          ? "text-green-600"
                          : "text-gray-600 group-hover:text-red-600"
                      }`}
                    />
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-700">
                  {c.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- PRODUCTS SECTION ---------------- */}
      <section className="mt-16 px-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Top Deals
          </h3>

          <button
            onClick={() => navigate("/search")}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            View All →
          </button>
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-500">
            Loading products...
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products available
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}