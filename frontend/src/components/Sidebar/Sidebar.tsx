import "./Sidebar.scss";
import Icon from "../Icon/Icon";
import { useState } from "react";
import type { FunctionComponent, SVGProps } from "react";

import DashboardIcon from "../../assets/icons/home.svg?react";
import NewOrderIcon from "../../assets/icons/cart.svg?react";
import MyOrdersIcon from "../../assets/icons/box.svg?react";
import CampaignsIcon from "../../assets/icons/bar-chart.svg?react";
import SettingsIcon from "../../assets/icons/cog.svg?react";
import LogoutIcon from "../../assets/icons/logout.svg?react";
import LayoutLeftIcon from "../../assets/icons/layout-left.svg?react";
import LayoutRightIcon from "../../assets/icons/layout-right.svg?react";
import jobPulseLogo from "../../assets/logos/jobpulse_logo.png";

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

interface NavItem {
  Icon: SvgComponent;
  label: string;
  page: string;
}

const navItems: NavItem[] = [
  { Icon: DashboardIcon, label: "Dashboard", page: "dashboard" },
  { Icon: NewOrderIcon, label: "New campaign", page: "new-campaign" },
  { Icon: MyOrdersIcon, label: "Campaigns", page: "campaigns" },
  { Icon: CampaignsIcon, label: "Media library", page: "media-library" },
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className={`sidebar${isCollapsed ? " collapsed" : ""}`}>
      <div className="sidebar-header">
        <img src={jobPulseLogo} alt="JobPulse" className="sidebar-logo" />
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon
            svg={isCollapsed ? LayoutRightIcon : LayoutLeftIcon}
            size={20}
          />
        </button>
      </div>

      <ul className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = activePage === item.page;
          return (
            <li
              key={item.label}
              className={`sidebar-nav-item${isActive ? " active" : ""}`}
              onClick={() => onNavigate(item.page)}
              title={isCollapsed ? item.label : undefined}
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
            title={isCollapsed ? item.label : undefined}
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
