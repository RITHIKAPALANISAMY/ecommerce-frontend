export default function RatingStars({ rating = 4 }) {
  return (
    <div style={{ color: "#f59e0b", fontSize: "14px" }}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
  );
}
