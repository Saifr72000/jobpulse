import "./Sidebar.scss";
import Icon from "../Icon/Icon";
import { useState } from "react";
import type { FunctionComponent, SVGProps } from "react";

import DashboardIcon from "../../assets/icons/home.svg?react";
import NewOrderIcon from "../../assets/icons/cart.svg?react";
import MyOrdersIcon from "../../assets/icons/box.svg?react";
import MediaLibraryIcon from "../../assets/icons/media.svg?react";
import SettingsIcon from "../../assets/icons/cog.svg?react";
import LogoutIcon from "../../assets/icons/logout.svg?react";
import LayoutLeftIcon from "../../assets/icons/layout-left.svg?react";
import LayoutRightIcon from "../../assets/icons/layout-right.svg?react";
import JobPulseMark from "../../assets/jobpulse-logo.svg?react";

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
  { Icon: MediaLibraryIcon, label: "Media library", page: "media-library" },
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
        <div className="sidebar-brand">
          <Icon svg={JobPulseMark} size={30} className="sidebar-brand__mark" />
          <span className="sidebar-brand__name">JobPulse</span>
        </div>
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
            className={`sidebar-nav-item${activePage === item.page ? " active" : ""}`}
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
