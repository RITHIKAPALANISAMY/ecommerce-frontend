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

  const slides = [
    {
      ttitle: "Big Fashion Sale",
      subtitle: "Up to 50% Off on Top Brands",
      image: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1600&q=80",
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
    <div className="relative w-full overflow-hidden rounded-xl">
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="relative min-w-full h-[260px] sm:h-[320px]"
          >
            <img
              src={s.image}
              alt={s.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 flex h-full items-center px-6 sm:px-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/90">
                  {s.subtitle}
                </p>
                <button className="mt-4 rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700">
                  {s.btn}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NAV BUTTONS */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white"
      >
        ❮
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white"
      >
        ❯
      </button>
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
    <div className="bg-gray-50 pb-10">

      {/* HERO (FULL WIDTH with SMALL SIDE GAP) */}
      <div className="px-3 sm:px-4 pt-4">
        <HeroSlider />
      </div>

      {/* CATEGORIES */}
      <div className="mt-8 grid grid-cols-3 gap-4 px-3 sm:grid-cols-6 sm:px-4">
        {categories.map((c) => (
          <div
            key={c.name}
            onClick={() => navigate(`/category/${c.name}`)}
            className="cursor-pointer rounded-xl bg-white p-4 text-center shadow hover:shadow-md transition"
          >
            <div className="text-2xl">{c.icon}</div>
            <p className="mt-2 text-sm font-medium">{c.name}</p>
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <section className="mt-10 px-3 sm:px-4">
        <h3 className="mb-5 text-lg font-semibold">Top Deals</h3>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

    </div>
  );
}
