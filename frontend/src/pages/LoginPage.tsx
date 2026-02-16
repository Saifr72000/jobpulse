import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Blurred lime ellipses – Figma Ellipse 1, 2, 3 */}
      <div
        className="absolute h-[328px] w-[375px] rounded-full bg-[#BEF853] opacity-90"
        style={{
          left: 'calc(50% + 252.5px - 375px/2)',
          top: 'calc(50% - 288.5px - 328px/2)',
          filter: 'blur(150px)',
        }}
        aria-hidden
      />
      <div
        className="absolute h-[572px] w-[605px] rounded-full bg-[#BEF853] opacity-90"
        style={{
          left: 'calc(50% - 386.5px - 605px/2)',
          top: 'calc(50% + 107.5px - 572px/2)',
          filter: 'blur(150px)',
        }}
        aria-hidden
      />
      <div
        className="absolute h-[430px] w-[454px] rounded-full bg-[#BEF853] opacity-90"
        style={{
          left: 'calc(50% + 754px - 454px/2)',
          top: 'calc(50% + 459.5px - 430px/2)',
          filter: 'blur(150px)',
        }}
        aria-hidden
      />

      {/* JobPulse – Figma: left 118px, top 80px, Inter 700 40px */}
      <h1
        className="absolute left-[118px] top-20 m-0 font-['Inter'] text-[40px] font-bold leading-[48px] text-black"
      >
        JobPulse
      </h1>

      {/* Rectangle 1 – card: 506×686, white, border #BEF853, rounded 40px, centered */}
      <div className="absolute left-1/2 top-1/2 box-border flex w-full max-w-[506px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[40px] border border-[#BEF853] bg-white px-[74px] py-12">
        <h2 className="mb-10 mt-0 font-['Inter'] text-[40px] font-bold leading-[48px] text-black">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex w-full flex-col">
          {/* Email – label Inter 600 20px; Line 1 = underline */}
          <label className="mb-1 block font-['Inter'] text-[20px] font-semibold leading-[24px] text-black">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
            className="mb-8 w-full border-0 border-b border-black bg-transparent py-2 font-['Inter'] text-[20px] leading-[24px] text-black outline-none placeholder:text-black/50 disabled:opacity-60"
          />

          {/* Password – label Inter 600 20px; Line 2 = underline */}
          <label className="mb-1 block font-['Inter'] text-[20px] font-semibold leading-[24px] text-black">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
            className="mb-6 w-full border-0 border-b border-black bg-transparent py-2 font-['Inter'] text-[20px] leading-[24px] text-black outline-none placeholder:text-black/50 disabled:opacity-60"
          />

          {/* Rectangle 3 – checkbox 20×20, white bg, 1px solid #000, rounded 5px */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <label className="inline-flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="h-5 w-5 shrink-0 cursor-pointer rounded-[5px] border border-black bg-white accent-black"
              />
              <span className="font-['Inter'] text-[20px] font-normal leading-[24px] text-black">
                Remember me
              </span>
            </label>
            <Link
              to="#"
              className="font-['Inter'] text-[20px] font-normal leading-[24px] text-black no-underline hover:underline"
            >
              Forgot password
            </Link>
          </div>

          {error && (
            <p className="mb-2 font-['Inter'] text-[16px] text-red-600">{error}</p>
          )}

          {/* Rectangle 2 – Login button: 359×66, black, rounded 20px; text Inter 600 20px white */}
          <button
            type="submit"
            disabled={loading}
            className="mx-auto mb-10 h-[66px] w-full max-w-[359px] cursor-pointer rounded-[20px] border-0 bg-black font-['Inter'] text-[20px] font-semibold leading-[24px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>

          {/* Don't have an account? Register – Inter 400 / 600, 20px */}
          <p className="text-center font-['Inter'] text-[20px] font-normal leading-[24px] text-black">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-black no-underline hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
