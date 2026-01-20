import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound">
      <h1>404</h1>
      <p>Page Not Found</p>

      <Link to="/" className="btn">
        Go to Home
      </Link>
    </div>
  );
}
