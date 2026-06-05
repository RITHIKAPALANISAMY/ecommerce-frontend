import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
} from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  const handleStartShopping = () => {
    localStorage.setItem("visited", "true");
    navigate("/");
  };

  const handleLogin = () => {
    localStorage.setItem("visited", "true");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center px-6 py-12 overflow-hidden">

      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* ================= LEFT SIDE ================= */}
        <div className="animate-fadeUp">

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8">

            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-xl opacity-30 rounded-full"></div>

              <div className="bg-gradient-to-br from-red-600 to-orange-500 text-white p-4 rounded-2xl shadow-xl animate-float">
                <ShoppingCart size={30} />
              </div>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">
              <span className="text-red-600">Shop</span>
              <span className="text-orange-500">Verse</span>
            </h2>
          </div>

          {/* HEADING */}
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              ShopVerse
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Discover amazing products, exclusive deals, and a seamless
            shopping experience — all in one powerful platform.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex gap-4 flex-wrap">

            <button
              onClick={handleStartShopping}
              className="bg-gradient-to-r from-red-600 to-orange-500 hover:scale-105 transition transform text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
            >
              Start Shopping
            </button>

            <button
              onClick={handleLogin}
              className="border border-gray-300 hover:bg-gray-100 transition px-8 py-3 rounded-xl font-semibold"
            >
              Login
            </button>

          </div>

          {/* FEATURES */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5">

            <Feature
              icon={<ShieldCheck className="text-green-600" />}
              title="100% Secure"
              subtitle="Safe Payments"
            />

            <Feature
              icon={<Truck className="text-blue-600" />}
              title="Fast Delivery"
              subtitle="Nationwide Shipping"
            />

            <Feature
              icon={<RotateCcw className="text-orange-500" />}
              title="Easy Returns"
              subtitle="7 Day Policy"
            />

            <Feature
              icon={<Star className="text-yellow-500" />}
              title="Top Rated"
              subtitle="Trusted by Buyers"
            />

          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex justify-center items-center">

          <div
            className="
              relative w-[380px] h-[380px]
              rounded-3xl
              bg-gradient-to-br
              from-red-600
              via-red-500
              to-orange-500
              shadow-2xl
              flex flex-col items-center justify-center
              text-white
              animate-fadeUp
            "
          >

            {/* Glow */}
            <div className="absolute inset-0 bg-white/10 blur-3xl"></div>

            {/* Floating Cart */}
            <div className="animate-float bg-white/20 backdrop-blur-lg p-6 rounded-full shadow-xl">
              <ShoppingCart size={80} strokeWidth={1.5} />
            </div>

            {/* Text */}
            <h3 className="mt-8 text-3xl font-bold tracking-wide">
              ALL IN ONE SHOP
            </h3>

            <p className="mt-3 text-sm opacity-90 text-center px-10">
              Everything you need — electronics, fashion, lifestyle &
              more in one place.
            </p>

            {/* Decorative Circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-white/10 rounded-full"></div>

          </div>

        </div>

      </div>
    </div>
  );
}

/* ================= FEATURE CARD ================= */

function Feature({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm border hover:shadow-md hover:-translate-y-1 transition duration-300">
      <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}