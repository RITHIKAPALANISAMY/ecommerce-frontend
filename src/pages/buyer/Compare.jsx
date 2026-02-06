import { useCompare } from "../../context/CompareContext";

export default function Compare() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center">
        <h2 className="text-lg font-semibold">
          Select at least 2 products to compare
        </h2>
      </div>
    );
  }

  const calculateScore = (p) =>
    p.rating * 2 + p.warranty - p.price / 10000;

  const bestProduct = compareItems.reduce((best, item) =>
    calculateScore(item) > calculateScore(best) ? item : best
  );

  return (
    <div className="p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Compare Products
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">Feature</th>
              {compareItems.map((item) => (
                <th
                  key={item.id}
                  className={`border p-3 ${
                    item.id === bestProduct.id
                      ? "bg-green-100"
                      : ""
                  }`}
                >
                  {item.title}
                  {item.id === bestProduct.id && (
                    <div className="text-sm font-bold text-green-600">
                      🏆 Best Choice
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border p-3 font-medium">Price</td>
              {compareItems.map((item) => (
                <td key={item.id} className="border p-3">
                  ₹{item.price}
                </td>
              ))}
            </tr>

            <tr>
              <td className="border p-3 font-medium">Rating</td>
              {compareItems.map((item) => (
                <td key={item.id} className="border p-3">
                  {item.rating} ⭐
                </td>
              ))}
            </tr>

            <tr>
              <td className="border p-3 font-medium">Action</td>
              {compareItems.map((item) => (
                <td key={item.id} className="border p-3">
                  <button
                    onClick={() => removeFromCompare(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={clearCompare}
          className="rounded bg-red-500 px-5 py-2 text-white hover:bg-red-600"
        >
          Clear Comparison
        </button>
      </div>
    </div>
  );
}
