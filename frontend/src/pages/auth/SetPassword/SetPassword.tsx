import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../api/axios";
import "./SetPassword.scss";

const RingsDecoration = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
    <circle cx="25" cy="25" r="24" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    <circle cx="25" cy="25" r="16" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    <circle cx="25" cy="25" r="8"  stroke="rgba(255,255,255,0.4)"  strokeWidth="1" />
  </svg>
);

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setError("Invalid invitation link. Please check your email and try again.");
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError("Password must contain uppercase, lowercase, and a number");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/auth/set-password", {
        token,
        newPassword,
        confirmPassword,
      });

      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login", { state: { message: "Password set successfully! You can now log in." } });
      }, 2000);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to set password. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="set-password">
        <div className="set-password__panel">
          <div className="set-password__glow" />
          <div className="set-password__rings">
            <RingsDecoration />
          </div>
          <div className="set-password__welcome">
            <h1 className="set-password__welcome-title">
              Welcome to <br />
              <span>JobPulz</span>
            </h1>
            <p className="set-password__tagline">
              Your campaign recruitment simplified. <br />
              You brief it. We build it. They apply.
            </p>
          </div>
        </div>

        <div className="set-password__form-panel">
          <div className="set-password__form-inner">
            <div className="set-password__success">
              <div className="set-password__success-icon">✓</div>
              <h1 className="set-password__heading">Password Set Successfully!</h1>
              <p className="set-password__subtitle">
                Redirecting you to login page...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="set-password">
      {/* Left panel — branding */}
      <div className="set-password__panel">
        <div className="set-password__glow" />
        <div className="set-password__rings">
          <RingsDecoration />
        </div>
        <div className="set-password__welcome">
          <h1 className="set-password__welcome-title">
            Welcome to <br />
            <span>JobPulz</span>
          </h1>
          <p className="set-password__tagline">
            Your campaign recruitment simplified. <br />
            You brief it. We build it. They apply.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="set-password__form-panel">
        <div className="set-password__form-inner">
          <div>
            <h1 className="set-password__heading">Set Your Password</h1>
            <p className="set-password__subtitle">
              Create a secure password to activate your account
            </p>
          </div>

          <form className="set-password__form" onSubmit={handleSubmit}>
            <div className="set-password__field">
              <label className="set-password__label" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your password"
                className="set-password__input"
                disabled={!token || isSubmitting}
              />
            </div>

            <div className="set-password__field">
              <label className="set-password__label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="set-password__input"
                disabled={!token || isSubmitting}
              />
            </div>

            <div className="set-password__requirements">
              <p className="set-password__requirements-title">Password must contain:</p>
              <ul className="set-password__requirements-list">
                <li className={newPassword.length >= 8 ? "valid" : ""}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(newPassword) ? "valid" : ""}>
                  One uppercase letter
                </li>
                <li className={/[a-z]/.test(newPassword) ? "valid" : ""}>
                  One lowercase letter
                </li>
                <li className={/\d/.test(newPassword) ? "valid" : ""}>
                  One number
                </li>
              </ul>
            </div>

            {error && <p className="set-password__error">{error}</p>}

            <button
              type="submit"
              disabled={!token || isSubmitting}
              className="set-password__btn"
            >
              {isSubmitting ? "Setting password..." : "Set Password & Continue"}
            </button>
          </form>

          <p className="set-password__login">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
