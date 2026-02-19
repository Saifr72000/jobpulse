import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  /** Optional custom logo position class; default is left-[118px] top-20 */
  logoClassName?: string;
}

export function AuthLayout({ children, logoClassName = 'left-[118px] top-20' }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
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
      <h1
        className={`absolute ${logoClassName} m-0 font-['Inter'] text-[40px] font-bold leading-[48px] text-black`}
      >
        JobPulse
      </h1>
      {children}
    </div>
  );
}
