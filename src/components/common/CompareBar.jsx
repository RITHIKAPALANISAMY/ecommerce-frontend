import { useNavigate, useLocation } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";

export default function CompareBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  // ✅ Show ONLY on compare page
  if (!location.pathname.startsWith("/compare")) return null;

  // ✅ Hide if less than 2 items
  if (compareItems.length < 2) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        <div className="flex items-center gap-4">
          <span className="font-semibold">
            Comparing ({compareItems.length}/3)
          </span>

          {compareItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded border px-2 py-1 text-sm"
            >
              <span className="max-w-[120px] truncate">
                {item.title}
              </span>
              <button
                onClick={() => removeFromCompare(item.id)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={clearCompare}
            className="rounded border px-4 py-2 text-sm"
          >
            Clear
          </button>

          <button
            onClick={() => navigate("/compare")}
            className="rounded bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}