import { Link } from 'react-router-dom';

export function RegisterCard() {
  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center justify-center rounded-3xl bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      <h2 className="mb-7 mt-0 text-2xl font-bold text-black">Register</h2>
      <p className="m-0 text-center text-gray-600">Registration will be available soon.</p>
      <p className="mt-6 text-center text-[0.95rem] text-black">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-black no-underline hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
