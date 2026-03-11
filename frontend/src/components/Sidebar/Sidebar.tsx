import "./Sidebar.scss";
import dashboardIcon from "../../assets/icons/home.svg";
import newCampaignIcon from "../../assets/icons/cart.svg";
import myOrdersIcon from "../../assets/icons/box.svg";
import campaignsIcon from "../../assets/icons/bar-chart.svg";
import candidatesIcon from "../../assets/icons/media.svg";
import mediaLibraryIcon from "../../assets/icons/users.svg";
import usersIcon from "../../assets/icons/settings.svg";
import settingsIcon from "../../assets/icons/cog.svg";
import logoutIcon from "../../assets/icons/logout.svg";

interface NavItem {
  icon: string;
  label: string;
  page: string;
}

const navItems: NavItem[] = [
  { icon: dashboardIcon, label: "Dashboard", page: "dashboard" },
  { icon: newCampaignIcon, label: "New order", page: "new-order" },
  { icon: myOrdersIcon, label: "My orders", page: "my-orders" },
  { icon: campaignsIcon, label: "Campaigns", page: "analytics" },
  { icon: candidatesIcon, label: "Candidates", page: "analytics" },
  { icon: mediaLibraryIcon, label: "Media library", page: "media-library" },
  { icon: usersIcon, label: "Users", page: "users" },
];

const bottomItems: NavItem[] = [
  { icon: settingsIcon, label: "Settings", page: "settings" },
  { icon: logoutIcon, label: "Log out", page: "logout" },
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
        {navItems.map((item) => (
          <li
            key={item.page}
            className={`sidebar-nav-item${activePage === item.page ? " active" : ""}`}
            onClick={() => onNavigate(item.page)}
          >
            <span className="nav-icon-wrap">
              <img src={item.icon} alt="" />
            </span>
            <span className="nav-label">{item.label}</span>
          </li>
        ))}
      </ul>

      <ul className="sidebar-bottom">
        {bottomItems.map((item) => (
          <li
            key={item.page}
            className="sidebar-nav-item"
            onClick={() => onNavigate(item.page)}
          >
            <span className="nav-icon-wrap">
              <img src={item.icon} alt="" />
            </span>
            <span className="nav-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
