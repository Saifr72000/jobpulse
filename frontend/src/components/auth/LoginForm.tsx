import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function LoginForm() {
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
    <div className="absolute left-1/2 top-1/2 box-border flex w-full max-w-[506px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[40px] border border-[#BEF853] bg-white px-[74px] py-12">
      <h2 className="mb-10 mt-0 font-['Inter'] text-[40px] font-bold leading-[48px] text-black">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="flex w-full flex-col">
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
        <button
          type="submit"
          disabled={loading}
          className="mx-auto mb-10 h-[66px] w-full max-w-[359px] cursor-pointer rounded-[20px] border-0 bg-black font-['Inter'] text-[20px] font-semibold leading-[24px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>
        <p className="text-center font-['Inter'] text-[20px] font-normal leading-[24px] text-black">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-black no-underline hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
