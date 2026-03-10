import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context";

const BoltIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M13 2L4.5 13.5H11L10 22L20.5 9.5H14L13 2Z"
      fill="#1a1a1a"
      strokeLinejoin="round"
    />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="12" width="4" height="9" fill="#BFFF00" />
    <rect x="10" y="7" width="4" height="14" fill="#BFFF00" />
    <rect x="17" y="3" width="4" height="18" fill="#BFFF00" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z"
      stroke="#BFFF00"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export default function LoginPage() {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Left panel — branding */}
      <div className="hidden md:flex flex-col justify-center w-1/2 bg-white px-16">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-16">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ backgroundColor: "#BFFF00" }}
          >
            <BoltIcon />
          </div>
          <span className="text-base font-semibold text-black">JobPulse</span>
        </div>

        {/* Headline */}
        <div className="mb-5">
          <h1 className="text-4xl font-bold text-black leading-tight">
            Campaign recruitment,
          </h1>
          <h1
            className="text-4xl font-bold leading-tight"
            style={{ color: "#BFFF00" }}
          >
            simplified.
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-[#555] text-sm mb-10 leading-relaxed">
          Track campaigns, manage candidates, and visualize
          <br />
          recruitment performance — all in one platform.
        </p>

        {/* Feature bullets */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <AnalyticsIcon />
            <span className="text-[#333] text-sm">
              Real-time campaign analytics
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldIcon />
            <span className="text-[#333] text-sm">
              Secure candidate management
            </span>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 bg-[#f5f5f5] px-12">
        <div className="max-w-sm w-full mx-auto">
          <h2 className="text-2xl font-bold text-black mb-1">Welcome back</h2>
          <p className="text-[#888] text-sm mb-8">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium text-black"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-white border border-[#e5e7eb] rounded-lg px-4 py-2.5 text-sm text-black placeholder-[#aaa] focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium text-black"
                htmlFor="password"
              >
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
                className="bg-white border border-[#e5e7eb] rounded-lg px-4 py-2.5 text-sm text-black placeholder-[#aaa] focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 bg-black text-white rounded-lg px-7 py-3 text-sm font-semibold cursor-pointer transition-colors hover:bg-[#222] border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-[#888] mt-6">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-black font-semibold hover:underline"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
