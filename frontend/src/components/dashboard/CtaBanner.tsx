import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CtaBannerProps {
  title: string;
  description: string;
  buttonLabel: string;
  to?: string;
}

export function CtaBanner({
  title,
  description,
  buttonLabel,
  to = '#',
}: CtaBannerProps) {
  return (
    <section className="rounded-[20px] bg-white p-6 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-['Helvetica'] text-[20px] font-bold leading-[23px] text-black">
            {title}
          </p>
          <p className="mt-1 font-['Helvetica'] text-[16px] font-normal leading-[18px] text-black">
            {description}
          </p>
        </div>
        <Link
          to={to}
          className="flex items-center gap-2 rounded-[40px] bg-[#BEF853] px-6 py-3 font-['Helvetica'] text-[18px] font-bold leading-[21px] text-[#424241] transition-opacity hover:opacity-90"
        >
          {buttonLabel}
          <ArrowRight className="h-5 w-5" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
