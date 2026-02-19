import { AuthLayout } from '../components/auth/AuthLayout';
import { RegisterCard } from '../components/auth/RegisterCard';

export function RegisterPage() {
  return (
    <div
      className="relative flex min-h-screen flex-col bg-white p-8"
      style={{
        background:
          'linear-gradient(to right, rgba(163,230,53,0.4) 0%, rgba(190,242,100,0.15) 35%, #fff 100%)',
      }}
    >
      <h1 className="absolute left-8 top-8 m-0 text-2xl font-bold text-black">JobPulse</h1>
      <RegisterCard />
    </div>
  );
}
