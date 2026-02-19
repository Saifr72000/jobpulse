import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBgClassName?: string;
}

export function KpiCard({ label, value, icon: Icon, iconBgClassName = 'bg-[#F1F4F8]' }: KpiCardProps) {
  return (
    <div className="rounded-[20px] bg-white p-6 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`flex h-[55px] w-[55px] items-center justify-center rounded-[10px] ${iconBgClassName}`}
        >
          <Icon className="h-[30px] w-[30px] text-[#424241]" strokeWidth={2} />
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F5F8]">
          <ArrowRight className="h-4 w-4 rotate-[140deg] text-[#424241]" strokeWidth={2} />
        </div>
      </div>
      <p className="font-['Helvetica'] text-[20px] leading-[23px] text-[#424241]">{label}</p>
      <p className="mt-1 font-['Helvetica'] text-[40px] font-bold leading-[46px] text-black">
        {value}
      </p>
    </div>
  );
}
