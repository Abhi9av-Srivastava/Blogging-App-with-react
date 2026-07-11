import { useState } from "react";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both your email and password.");
      return;
    }

    setError("");
    onLogin(email.trim());
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-illustration" aria-hidden="true">
          <div className="login-bubble" />
          <div className="login-bubble small" />
        </div>

        <h1>Welcome back</h1>
        <p>Sign in to continue to your blogging workspace.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" className="login-btn">
            Sign in
          </button>
        </form>

        <p className="login-hint">Use any email and password to continue.</p>
      </div>
    </div>
  );
}

export default LoginPage;
