import { ShoppingCart } from "lucide-react";

export default function Logo({ size = "text-3xl" }) {
  return (
    <div className="flex items-center gap-3 animate-fadeIn">

      {/* ICON */}
      <div className="relative">
        <div className="absolute inset-0 bg-red-500 blur-xl opacity-30 rounded-full"></div>

        <div className="bg-gradient-to-br from-red-600 to-orange-500 text-white p-3 rounded-2xl shadow-xl animate-float">
          <ShoppingCart size={28} />
        </div>
      </div>

      {/* TEXT */}
      <h1 className={`${size} font-extrabold tracking-tight`}>
        <span className="text-red-600">Shop</span>
        <span className="text-orange-500">Verse</span>
      </h1>
    </div>
  );
}