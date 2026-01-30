export default function RatingStars({ rating = 0, size = "sm" }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={`flex items-center gap-0.5 text-yellow-500 ${
        sizeClasses[size] || "text-sm"
      }`}
      aria-label={`Rating ${rating} out of 5`}
    >
      {/* FULL STARS */}
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <span key={`full-${i}`}>★</span>
        ))}

      {/* HALF STAR */}
      {hasHalfStar && <span>☆</span>}

      {/* EMPTY STARS */}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">
            ★
          </span>
        ))}
    </div>
  );
}
