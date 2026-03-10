import { useNavigate } from "react-router-dom";

const imgCommercial =
  "https://www.figma.com/api/mcp/asset/7c968a00-0475-4ace-bb0f-db12d6205898";
const imgGroup =
  "https://www.figma.com/api/mcp/asset/33534bc9-ee6b-429f-84b8-96353e051e9c";
const imgCoins =
  "https://www.figma.com/api/mcp/asset/e47ffc2c-2982-43df-9259-d73dae6d1693";
const imgTrophy =
  "https://www.figma.com/api/mcp/asset/8401e075-e788-4ca4-aa11-a8ec94f401c1";
const imgForward =
  "https://www.figma.com/api/mcp/asset/a366f735-6d89-446a-96d1-4dd85c157ab9";

const weeklyData = [
  { week: "W1", height: 62 },
  { week: "W2", height: 50 },
  { week: "W3", height: 26 },
  { week: "W4", height: 57 },
  { week: "W5", height: 68 },
  { week: "W6", height: 93, tooltip: "32% increase" },
];

const channels = [
  { name: "Facebook", percent: "55%", width: "100%" },
  { name: "LinkedIn", percent: "32%", width: "94%" },
  { name: "Snapchat", percent: "32%", width: "64%" },
  { name: "TikTok", percent: "32%", width: "56%" },
  { name: "X", percent: "32%", width: "38%" },
  { name: "Schibsted", percent: "32%", width: "20%" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#d0d0d0_transparent]">

      {/* Stat Cards */}
      <div className="flex gap-6">
        {[
          { bg: "#d5e9fc", img: imgCommercial, alt: "Active campaigns", label: "Active campaigns", value: "3" },
          { bg: "#fcd5f7", img: imgGroup, alt: "Applications received", label: "Applications received", value: "25" },
          { bg: "#ddff9d", img: imgCoins, alt: "Spend", label: "Spend", value: "150 000 NOK", small: true },
        ].map((card) => (
          <div key={card.label} className="flex-1 bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] px-[39px] py-[23px] flex flex-col">
            <div
              className="w-[55px] h-[55px] rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: card.bg }}
            >
              <img src={card.img} alt={card.alt} className="w-[31px] h-[31px] object-contain" />
            </div>
            <p className="text-[20px] text-text mt-5">{card.label}</p>
            <div className="flex items-center justify-between mt-2">
              <span className={`font-bold text-black leading-tight ${card.small ? "text-[32px]" : "text-[40px]"}`}>
                {card.value}
              </span>
              <button
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-base text-text transition-colors hover:bg-border shrink-0 border-0 cursor-pointer"
                aria-label={`View ${card.label}`}
              >
                ↗
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="flex gap-6 flex-1">
        {/* Bar Chart */}
        <div className="flex-3 bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-8 flex flex-col min-w-0">
          <h2 className="text-[32px] font-bold text-black">Total views per week</h2>
          <p className="text-[20px] text-text mt-1">All campaigns</p>
          <div className="flex items-end gap-4 flex-1 mt-8 pt-12">
            {weeklyData.map((d) => (
              <div key={d.week} className="flex flex-col items-center flex-1">
                <div className="w-full h-[220px] flex flex-col items-center justify-end relative">
                  {d.tooltip && (
                    <div className="absolute top-0 flex flex-col items-center gap-1 -translate-y-full pb-1">
                      <span className="bg-text text-[#fcfdfe] text-[10px] px-[10px] py-1 rounded-[40px] whitespace-nowrap">
                        {d.tooltip}
                      </span>
                      <span className="w-2 h-2 bg-text rounded-full shrink-0" />
                    </div>
                  )}
                  <div
                    className="w-full max-w-[68px] bg-[#6cbcf6] rounded-[10px] transition-opacity hover:opacity-85"
                    style={{ height: `${d.height}%` }}
                  />
                </div>
                <span className="text-sm text-text-muted mt-[10px]">{d.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Performance */}
        <div className="flex-2 bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] p-8 min-w-0">
          <h2 className="text-[32px] font-bold text-black">Channel performance</h2>
          <div className="flex items-center gap-3 bg-background rounded-[20px] px-[18px] py-[14px] mt-5 text-base text-text">
            <img src={imgTrophy} alt="" className="w-[34px] h-[34px] object-contain shrink-0" />
            <span>Facebook is leading on channel performance</span>
          </div>
          <div className="flex flex-col gap-5 mt-6">
            {channels.map((ch) => (
              <div key={ch.name} className="flex flex-col gap-[6px]">
                <span className="text-[18px] text-text">{ch.name}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-[15px] bg-[#6cbcf6] rounded-[20px] transition-[width] duration-300 ease-in-out"
                    style={{ width: ch.width }}
                  />
                  <span className="text-[10px] text-text shrink-0">{ch.percent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Banner */}
      <div className="bg-white rounded-[20px] shadow-[0_0_15px_rgba(0,0,0,0.05)] px-8 py-5 flex items-center justify-between gap-6">
        <div>
          <h3 className="text-[20px] font-bold text-black">Ready to launch a new campaign?</h3>
          <p className="text-base text-black mt-1">Create targeted job ads across multiple channels.</p>
        </div>
        <button
          className="flex items-center gap-[10px] bg-black text-white rounded-[40px] px-7 py-[13px] text-lg font-bold cursor-pointer transition-colors hover:bg-[#333] whitespace-nowrap shrink-0 border-0"
          onClick={() => navigate("/orders/new")}
        >
          Create campaign
          <img src={imgForward} alt="" className="w-[15px] h-[15px] object-contain invert" />
        </button>
      </div>
    </div>
  );
}
