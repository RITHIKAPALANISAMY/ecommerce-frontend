import { useNavigate } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";
import { useCart } from "../../context/CartContext";

export default function Compare() {
  const navigate = useNavigate();
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  // 🚫 Empty state
  if (compareItems.length < 2) {
    return (
      <div className="mx-auto max-w-5xl py-20 text-center">
        <h2 className="text-2xl font-semibold">Nothing to compare</h2>
        <p className="mt-2 text-gray-500">
          Add at least 2 products to compare
        </p>
      </div>
    );
  }

  // 🧠 BEST CHOICE LOGIC (Rating > Price > Stock)
  const scoredProducts = compareItems.map((p) => {
    const ratingScore = (p.rating?.rate || 0) * 50;   // ⭐ priority
    const priceScore = 10000 / (p.price || 1);        // 💰 lower is better
    const stockPenalty = p.stock === 0 ? -1000 : 0;   // 📦 penalize OOS

    return {
      ...p,
      score: ratingScore + priceScore + stockPenalty,
    };
  });

  const bestProductId = [...scoredProducts]
    .sort((a, b) => b.score - a.score)[0]?.id;

  return (
    <div className="bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl rounded-xl bg-white p-6 shadow">

        <h1 className="mb-6 text-center text-2xl font-semibold">
          Compare Products
        </h1>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-[900px] border-collapse">
            <thead className="sticky top-0 z-10 bg-white shadow-sm">
              <tr>
                <th className="border p-4 text-left">Feature</th>
                {compareItems.map((p) => (
                  <th
                    key={p.id}
                    className={`border p-4 text-center ${
                      p.id === bestProductId
                        ? "bg-green-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-medium">{p.title}</span>
                      {p.id === bestProductId && (
                        <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          🏆 Best Choice
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>

              {/* IMAGE */}
              <tr>
                <td className="border p-4 font-medium">Image</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="border p-4 text-center">
                    <img
                      src={p.images?.[0]}
                      alt={p.title}
                      className="mx-auto h-28 cursor-pointer object-contain"
                      onClick={() => navigate(`/product/${p.id}`)}
                    />
                  </td>
                ))}
              </tr>

              {/* PRICE */}
              <tr>
                <td className="border p-4 font-medium">Price</td>
                {compareItems.map((p) => (
                  <td
                    key={p.id}
                    className="border p-4 text-center font-semibold text-red-600"
                  >
                    ₹{p.price}
                  </td>
                ))}
              </tr>
{/* RATING */}
<tr>
  <td className="border p-4 font-medium">Rating</td>
  {compareItems.map((p) => (
    <td key={p.id} className="border p-4 text-center">
      {p.rating?.rate ? (
        <>
          ⭐ {p.rating.rate}
          <span className="text-sm text-gray-500">
            {" "}({p.rating.count} reviews)
          </span>
        </>
      ) : (
        <span className="text-gray-400">No ratings yet</span>
      )}
    </td>
  ))}
</tr>



              {/* STOCK */}
              <tr>
                <td className="border p-4 font-medium">Stock</td>
                {compareItems.map((p) => (
                  <td
                    key={p.id}
                    className={`border p-4 text-center ${
                      p.stock === 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {p.stock === 0 ? "Out of stock" : "Available"}
                  </td>
                ))}
              </tr>

              {/* WARRANTY */}
              <tr>
                <td className="border p-4 font-medium">Warranty</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="border p-4 text-center">
                    {p.description?.warranty || "—"}
                  </td>
                ))}
              </tr>

              {/* ACTIONS */}
              <tr>
                <td className="border p-4 font-medium">Actions</td>
                {compareItems.map((p) => (
                  <td
                    key={p.id}
                    className="border p-4 text-center space-y-2"
                  >
                    <button
                      onClick={() => addToCart({ ...p, quantity: 1 })}
                      className="w-full rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="w-full text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={clearCompare}
            className="rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
          >
            Clear Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
