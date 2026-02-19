import { WEEK_LABELS, WEEK_VALUES } from '../../data/dashboardData';

export function ViewsChart() {
  const maxVal = Math.max(...WEEK_VALUES);

  return (
    <div className="flex-1 rounded-[20px] bg-white p-6 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
      <h2 className="font-['Helvetica'] text-[32px] font-bold leading-[37px] text-black">
        Total views per week
      </h2>
      <p className="mt-1 font-['Helvetica'] text-[20px] leading-[23px] text-[#424241]">
        All campaigns
      </p>
      <div className="mt-8 flex items-end justify-between gap-3">
        {WEEK_LABELS.map((label, i) => {
          const heightPct = (WEEK_VALUES[i] / maxVal) * 100;
          const isLast = i === WEEK_LABELS.length - 1;
          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div className="relative flex h-36 w-full items-end justify-center">
                {isLast && (
                  <div className="absolute -top-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
                    <div className="rounded-[40px] bg-[#424241] px-2 py-1">
                      <span className="font-['Helvetica'] text-[10px] leading-[11px] text-[#FCFDFE]">
                        32% increase
                      </span>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-[#424241]" />
                  </div>
                )}
                <div
                  className="w-full max-w-16 rounded-t transition-all"
                  style={{
                    height: `${heightPct}%`,
                    minHeight: 24,
                    background: 'linear-gradient(180deg, #BEF853 0%, #88CE0A 100%)',
                  }}
                />
              </div>
              <span className="mt-2 font-['Helvetica'] text-[14px] leading-[16px] text-[#6B7280]">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
