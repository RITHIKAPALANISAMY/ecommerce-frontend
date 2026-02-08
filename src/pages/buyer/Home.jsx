import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Laptop,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  ShoppingCart,
} from "lucide-react";
import ProductCard from "../../components/common/ProductCard";
import { useProducts } from "../../context/ProductContext";

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
          <div
            key={i}
            className="relative min-w-full h-[260px] sm:h-[360px]"
          >
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
                <button className="mt-6 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 hover:scale-105">
                  {s.btn}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

/* ---------------- CATEGORIES ---------------- */

const categories = [
  { name: "Mobiles", icon: Smartphone },
  { name: "Electronics", icon: Laptop },
  { name: "Fashion", icon: Shirt },
  { name: "Home", icon: HomeIcon },
  { name: "Beauty", icon: Sparkles },
  { name: "Grocery", icon: ShoppingCart },
];

/* ---------------- HOME PAGE ---------------- */

export default function Home() {
  const navigate = useNavigate();
  const { products } = useProducts();

  return (
    <div className="bg-gray-50 pb-12">
      {/* HERO */}
      <div className="px-3 sm:px-4 pt-4">
        <HeroSlider />
      </div>

      {/* CATEGORIES */}
      <div className="mt-10 px-3 sm:px-4">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Shop by Category
        </h3>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {categories.map((c) => {
            const Icon = c.icon;

            return (
              <div
                key={c.name}
                onClick={() => navigate(`/category/${c.name}`)}
                className="group cursor-pointer rounded-2xl bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon
                  size={28}
                  className="mx-auto text-gray-600 transition group-hover:text-red-600"
                />
                <p className="mt-2 text-sm font-medium text-gray-700">
                  {c.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="mt-12 px-3 sm:px-4">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Top Deals
          </h3>
          <button className="text-sm font-medium text-red-600 hover:underline">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
