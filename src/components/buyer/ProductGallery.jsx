import { useState } from "react";

export default function ProductGallery({ images = [] }) {
  const [active, setActive] = useState(images[0]);

  if (!images.length) return null;

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      
      <div className="flex gap-3 md:flex-col md:w-20">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(img)}
            className={`rounded-lg border p-1 transition ${
              active === img
                ? "border-red-500 ring-2 ring-red-200"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className="h-16 w-16 object-cover rounded-md"
            />
          </button>
        ))}
      </div>

      
      <div className="flex flex-1 items-center justify-center rounded-xl bg-white border p-4">
        <img
          src={active}
          alt="Product"
          className="max-h-[420px] w-full object-contain"
        />
      </div>
    </div>
  );
}
