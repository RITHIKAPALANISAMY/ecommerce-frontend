import "../../styles/reviews.css";

export default function Reviews({ reviews }) {
  if (!reviews?.length) return null;

  return (
    <div className="reviews">
      {reviews.slice(0, 3).map(r => (
        <div key={r.id} className="review-item">
          <div className="review-left">
            <span className="star-badge">{r.rating}★</span>
            <span className="review-title">{r.title}</span>
          </div>

          <div className="review-meta">
            <span className="user">{r.user}</span>
            <span className="date">{r.date}</span>
          </div>

          <div className="review-sub">
            <span className="verified">✔ Certified Buyer</span>
            <span className="location">{r.location}</span>
          </div>

          <div className="review-actions">
            👍 {r.likes} &nbsp;&nbsp; 👎 {r.dislikes}
          </div>
        </div>
      ))}

      <div className="all-reviews">
        All {reviews.length} reviews →
      </div>
    </div>
  );
}
