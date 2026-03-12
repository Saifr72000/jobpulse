import "./Sidebar.scss";
import Icon from "../Icon/Icon";
import type { FunctionComponent, SVGProps } from "react";

import DashboardIcon from "../../assets/icons/home.svg?react";
import NewOrderIcon from "../../assets/icons/cart.svg?react";
import MyOrdersIcon from "../../assets/icons/box.svg?react";
import CampaignsIcon from "../../assets/icons/bar-chart.svg?react";
import CandidatesIcon from "../../assets/icons/media.svg?react";
import MediaLibraryIcon from "../../assets/icons/users.svg?react";
import UsersIcon from "../../assets/icons/settings.svg?react";
import SettingsIcon from "../../assets/icons/cog.svg?react";
import LogoutIcon from "../../assets/icons/logout.svg?react";

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

interface NavItem {
  Icon: SvgComponent;
  label: string;
  page: string;
}

const navItems: NavItem[] = [
  { Icon: DashboardIcon, label: "Dashboard", page: "dashboard" },
  { Icon: NewOrderIcon, label: "New order", page: "new-order" },
  { Icon: MyOrdersIcon, label: "My orders", page: "my-orders" },
  { Icon: CampaignsIcon, label: "Campaigns", page: "analytics" },
  { Icon: CandidatesIcon, label: "Candidates", page: "analytics" },
  { Icon: MediaLibraryIcon, label: "Media library", page: "media-library" },
  { Icon: UsersIcon, label: "Users", page: "users" },
];

const bottomItems: NavItem[] = [
  { Icon: SettingsIcon, label: "Settings", page: "settings" },
  { Icon: LogoutIcon, label: "Log out", page: "logout" },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">JobPulse</div>

      <ul className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = activePage === item.page;
          return (
            <li
              key={item.label}
              className={`sidebar-nav-item${isActive ? " active" : ""}`}
              onClick={() => onNavigate(item.page)}
            >
              <span className="nav-icon-wrap">
                <Icon svg={item.Icon} size={20} />
              </span>
              <span className="nav-label">{item.label}</span>
            </li>
          );
        })}
      </ul>

      <ul className="sidebar-bottom">
        {bottomItems.map((item) => (
          <li
            key={item.label}
            className="sidebar-nav-item"
            onClick={() => onNavigate(item.page)}
          >
            <span className="nav-icon-wrap">
              <Icon svg={item.Icon} size={20} />
            </span>
            <span className="nav-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
