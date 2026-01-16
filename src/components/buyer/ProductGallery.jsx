import { useState } from "react";

export default function ProductGallery({ images }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="gallery">
      <div className="thumbnails">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className={active === img ? "active" : ""}
            onClick={() => setActive(img)}
          />
        ))}
      </div>

      <div className="main-image">
        <img src={active} />
      </div>
    </div>
  );
}
