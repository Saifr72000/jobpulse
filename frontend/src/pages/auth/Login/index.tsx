import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context";
import "./Login.scss";

const RingsDecoration = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
    <circle cx="25" cy="25" r="24" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    <circle cx="25" cy="25" r="16" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    <circle cx="25" cy="25" r="8"  stroke="rgba(255,255,255,0.4)"  strokeWidth="1" />
  </svg>
);

export default function LoginPage() {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      // error is set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login">
      {/* Left panel — branding */}
      <div className="login__panel">
        <div className="login__glow" />
        <div className="login__rings">
          <RingsDecoration />
        </div>
        <div className="login__welcome">
          <h1 className="login__welcome-title">
            Welcome to <br />
            <span>JobPulz</span>
          </h1>
          <p className="login__tagline">
            Your campaign recruitment simplified. <br />
            You brief it. We build it. They apply.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login__form-panel">
        <div className="login__form-inner">
          <div>
            <h1 className="login__heading">Let's get started</h1>
            <p className="login__subtitle">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__field">
              <label className="login__label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="You@example.com"
                className="login__input"
              />
            </div>

            <div className="login__field">
              <label className="login__label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="login__input"
              />
            </div>

            <div className="login__options">
              <label className="login__remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <button type="button" className="login__forgot">
                Forgot password?
              </button>
            </div>

            {error && <p className="login__error">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="login__btn"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="login__register">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}
