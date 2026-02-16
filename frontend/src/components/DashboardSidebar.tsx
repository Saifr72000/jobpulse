import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ShoppingCart,
  Package,
  Gift,
  BarChart3,
  Handshake,
  Image,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/new-order', label: 'New order', icon: ShoppingCart },
  { to: '/my-orders', label: 'My orders', icon: Package },
  { to: '/value-card', label: 'Value card', icon: Gift },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/frame-agreement', label: 'Frame agreement', icon: Handshake },
  { to: '/media', label: 'Media library', icon: Image },
  { to: '/users', label: 'Users', icon: Users },
] as const;

const bottomItems = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/logout', label: 'Log out', icon: LogOut },
] as const;

export function DashboardSidebar({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();

  return (
    <aside className="flex min-h-full w-[260px] shrink-0 flex-col rounded-[20px] bg-white p-4 shadow-[0px_0px_15px_rgba(0,0,0,0.05)]">
      <h1 className="mb-8 font-['Helvetica'] text-[32px] font-bold leading-[37px] text-black">
        JobPulse
      </h1>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 rounded-[40px] px-4 py-3 font-['Helvetica'] text-[15px] leading-[17px] ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-[#424241] hover:bg-[#F1F4F8]'
              }`}
            >
              <span
                className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${isActive ? 'bg-white' : ''}`}
              >
                <Icon
                  className={isActive ? 'text-black' : 'text-[#424241]'}
                  size={20}
                  strokeWidth={2}
                />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-[#F1F4F8] pt-4">
        {bottomItems.map(({ to, label, icon: Icon }) =>
          to === '/logout' ? (
            <button
              key={to}
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-4 rounded-[40px] px-4 py-3 font-['Helvetica'] text-[15px] leading-[17px] text-[#424241] hover:bg-[#F1F4F8]"
            >
              <Icon size={20} strokeWidth={2} />
              {label}
            </button>
          ) : (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-4 rounded-[40px] px-4 py-3 font-['Helvetica'] text-[15px] leading-[17px] text-[#424241] hover:bg-[#F1F4F8]"
            >
              <Icon size={20} strokeWidth={2} />
              {label}
            </Link>
          )
        )}
      </div>
    </aside>
  );
}
