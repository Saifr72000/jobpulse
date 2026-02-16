import { Link } from 'react-router-dom';
import { Megaphone, Users, Coins, Trophy, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { DashboardSidebar } from '../components/DashboardSidebar.tsx';

const WEEK_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
const WEEK_VALUES = [40, 55, 70, 50, 75, 95];
const CHANNELS = [
  { name: 'Facebook', value: 55 },
  { name: 'LinkedIn', value: 32 },
  { name: 'Snapchat', value: 32 },
  { name: 'TikTok', value: 32 },
  { name: 'X', value: 32 },
  { name: 'Schibsted', value: 32 },
];

function formatDate(date: Date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = date.getDate();
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = date.getFullYear();
  return `It's ${days[date.getDay()].toLowerCase()}, ${d}. ${month}, ${year}`;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function HomePage() {
  const { user, logout } = useAuth();
  const today = new Date();

  return (
    <div className="flex min-h-screen bg-[#F1F4F8]">
      <DashboardSidebar onLogout={logout} />

      <div className="flex flex-1 flex-col p-6 pl-8">
        {/* Top: Dashboard title + date, User profile */}
        <header className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-['Helvetica'] text-[40px] font-bold leading-[46px] text-black">
              Dashboard
            </h1>
            <p className="mt-1 font-['Helvetica'] text-[20px] font-normal leading-[23px] text-[#424241]">
              {formatDate(today)}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-[15px] border border-[#E5E7EB] bg-white px-3 py-2.5">
            <div className="flex h-[37px] w-[37px] items-center justify-center rounded-[10px] bg-gradient-to-b from-[#7CADFE] to-[#D3E2FB] font-['Inter'] text-[14px] font-medium leading-[17px] text-black">
              {user ? getInitials(user.firstName, user.lastName) : 'JD'}
            </div>
            <div className="flex flex-col">
              <span className="font-['Inter'] text-[14px] font-medium leading-[17px] text-black">
                {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
              </span>
              <span className="font-['Inter'] text-[10px] font-medium leading-[12px] text-[#6B7280]">
                Customer
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-[#424241]" strokeWidth={2} />
          </div>
        </header>

        {/* KPI cards */}
        <section className="mb-6 grid grid-cols-3 gap-5">
          <div className="rounded-[20px] bg-white p-6 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-[55px] w-[55px] items-center justify-center rounded-[10px] bg-[#D5E9FC]">
                <Megaphone className="h-[30px] w-[30px] text-[#424241]" strokeWidth={2} />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F5F8]">
                <ArrowRight className="h-4 w-4 rotate-[140deg] text-[#424241]" strokeWidth={2} />
              </div>
            </div>
            <p className="font-['Helvetica'] text-[20px] leading-[23px] text-[#424241]">
              Active campaigns
            </p>
            <p className="mt-1 font-['Helvetica'] text-[40px] font-bold leading-[46px] text-black">
              3
            </p>
          </div>
          <div className="rounded-[20px] bg-white p-6 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-[55px] w-[55px] items-center justify-center rounded-[10px] bg-[#F1F4F8]">
                <Users className="h-[30px] w-[30px] text-[#424241]" strokeWidth={2} />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F5F8]">
                <ArrowRight className="h-4 w-4 rotate-[140deg] text-[#424241]" strokeWidth={2} />
              </div>
            </div>
            <p className="font-['Helvetica'] text-[20px] leading-[23px] text-[#424241]">
              Applications received
            </p>
            <p className="mt-1 font-['Helvetica'] text-[40px] font-bold leading-[46px] text-black">
              25
            </p>
          </div>
          <div className="rounded-[20px] bg-white p-6 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-[55px] w-[55px] items-center justify-center rounded-[10px] bg-[#DDFF9D]">
                <Coins className="h-[30px] w-[30px] text-[#424241]" strokeWidth={2} />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F5F8]">
                <ArrowRight className="h-4 w-4 rotate-[140deg] text-[#424241]" strokeWidth={2} />
              </div>
            </div>
            <p className="font-['Helvetica'] text-[20px] leading-[23px] text-[#424241]">Spend</p>
            <p className="mt-1 font-['Helvetica'] text-[40px] font-bold leading-[46px] text-black">
              150 000 NOK
            </p>
          </div>
        </section>

        {/* Two main cards: Total views + Channel performance */}
        <section className="mb-6 flex gap-6">
          <div className="flex-1 rounded-[20px] bg-white p-6 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
            <h2 className="font-['Helvetica'] text-[32px] font-bold leading-[37px] text-black">
              Total views per week
            </h2>
            <p className="mt-1 font-['Helvetica'] text-[20px] leading-[23px] text-[#424241]">
              All campaigns
            </p>
            <div className="mt-8 flex items-end justify-between gap-3">
              {WEEK_LABELS.map((label, i) => {
                const maxVal = Math.max(...WEEK_VALUES);
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
        </section>

        {/* CTA banner */}
        <section className="rounded-[20px] bg-white p-6 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-['Helvetica'] text-[20px] font-bold leading-[23px] text-black">
                Ready to launch a new campaign?
              </p>
              <p className="mt-1 font-['Helvetica'] text-[16px] font-normal leading-[18px] text-black">
                Create targeted job ads across multiple channels.
              </p>
            </div>
            <Link
              to="#"
              className="flex items-center gap-2 rounded-[40px] bg-[#BEF853] px-6 py-3 font-['Helvetica'] text-[18px] font-bold leading-[21px] text-[#424241] transition-opacity hover:opacity-90"
            >
              Create campaign
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
