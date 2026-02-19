import { ChevronDown } from 'lucide-react';
import type { AuthUser } from '../../api/auth';
import { formatDate } from '../../utils/date';
import { getInitials } from '../../utils/format';

interface DashboardHeaderProps {
  title: string;
  date: Date;
  user: AuthUser | null;
}

export function DashboardHeader({ title, date, user }: DashboardHeaderProps) {
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'John Doe';
  const initials = user ? getInitials(user.firstName, user.lastName) : 'JD';

  return (
    <header className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="font-['Helvetica'] text-[40px] font-bold leading-[46px] text-black">
          {title}
        </h1>
        <p className="mt-1 font-['Helvetica'] text-[20px] font-normal leading-[23px] text-[#424241]">
          {formatDate(date)}
        </p>
      </div>
      <div className="flex items-center gap-3 rounded-[15px] border border-[#E5E7EB] bg-white px-3 py-2.5">
        <div className="flex h-[37px] w-[37px] items-center justify-center rounded-[10px] bg-gradient-to-b from-[#7CADFE] to-[#D3E2FB] font-['Inter'] text-[14px] font-medium leading-[17px] text-black">
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="font-['Inter'] text-[14px] font-medium leading-[17px] text-black">
            {displayName}
          </span>
          <span className="font-['Inter'] text-[10px] font-medium leading-[12px] text-[#6B7280]">
            Customer
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-[#424241]" strokeWidth={2} />
      </div>
    </header>
  );
}
