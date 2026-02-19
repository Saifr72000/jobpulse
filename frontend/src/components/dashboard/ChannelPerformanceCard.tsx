import { Trophy } from 'lucide-react';
import { CHANNELS } from '../../data/dashboardData';

export function ChannelPerformanceCard() {
  return (
    <div className="w-[544px] shrink-0 rounded-[20px] bg-white p-6 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
      <h2 className="font-['Helvetica'] text-[32px] font-bold leading-[37px] text-black">
        Channel performance
      </h2>
      <div className="mt-4 flex items-center gap-3 rounded-[20px] bg-[#F1F4F8] px-4 py-4">
        <Trophy className="h-[34px] w-[34px] shrink-0 text-[#424241]" strokeWidth={2} />
        <p className="font-['Helvetica'] text-[20px] leading-[23px] text-[#424241]">
          Facebook is leading on channel performance
        </p>
      </div>
      <div className="mt-6 space-y-4">
        {CHANNELS.map(({ name, value }) => (
          <div key={name} className="flex items-center gap-4">
            <span className="w-[100px] shrink-0 font-['Helvetica'] text-[20px] leading-[23px] text-[#424241]">
              {name}
            </span>
            <div className="h-[15px] flex-1 overflow-hidden rounded-[20px] bg-[#F1F4F8]">
              <div
                className="h-full rounded-[20px] bg-[#BEF853]"
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="w-8 text-right font-['Helvetica'] text-[10px] leading-[11px] text-[#424241]">
              {value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
