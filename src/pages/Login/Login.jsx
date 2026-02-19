import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config";
import "./Login.css";
import "../Register/Register.css";
import logo from "../../assets/chronicle-logo.svg";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin();
    } catch {
      setError("Something went wrong. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Chronicle" className="login-image-circle" />
        <h1 className="login-title">Happy Chronicling!</h1>

        {error && <p className="auth-error">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">Email or Username</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              placeholder="Email or username..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn-register"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
            <button type="submit" className="btn-signin" disabled={loading}>
              {loading ? "Signing in..." : "Sign-In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
