export default function Register() {
  return (
    <div className="auth-page">
      <h2>Create Account</h2>

      <form>
        <input placeholder="Name" />
        <input placeholder="Email" />
        <input placeholder="Password" />
        <button className="btn">Register</button>
      </form>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
