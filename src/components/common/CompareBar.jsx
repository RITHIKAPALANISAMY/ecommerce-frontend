import { useNavigate, useLocation } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";

export default function CompareBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  // ❌ Hide on home page
  if (location.pathname === "/") return null;

  // ❌ Hide if less than 2 items
  if (compareItems.length < 2) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <span className="font-semibold">
            Compare ({compareItems.length}/3)
          </span>

          {compareItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded border px-2 py-1 text-sm"
            >
              <span className="line-clamp-1 max-w-[120px]">
                {item.title}
              </span>
              <button
                onClick={() => removeFromCompare(item.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove from compare"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="flex gap-3">
          <button
            onClick={clearCompare}
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Clear
          </button>

          <button
            onClick={() => navigate("/compare")}
            className="rounded bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}
