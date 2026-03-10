import "./Sidebar.css";
import dashboardIcon from "../assets/icons/home.svg";

const imgAddShoppingCart =
  "https://www.figma.com/api/mcp/asset/f3f30aa5-8294-4a22-8197-bf1b3d2bb286";
const imgShoppingCart =
  "https://www.figma.com/api/mcp/asset/6d30fea8-d9b8-4309-b4ab-fb5d52d63303";
const imgBarChart =
  "https://www.figma.com/api/mcp/asset/8de3c751-e4e3-425d-913d-4b7f0a56538a";
const imgMediaLibrary =
  "https://www.figma.com/api/mcp/asset/85fddeac-0cd7-4b8c-b3c7-3f69940c5956";
const imgUsers =
  "https://www.figma.com/api/mcp/asset/2f6ec83d-c0a1-4a1a-8fc6-aa1106018c60";
const imgSettings =
  "https://www.figma.com/api/mcp/asset/9b300bed-f7dd-4c35-9785-09118d45f926";
const imgLogout =
  "https://www.figma.com/api/mcp/asset/b3d5bc82-eaa6-43f1-9c2a-d1fdb44f97ea";

interface NavItem {
  icon: string;
  label: string;
  page: string;
}

const navItems: NavItem[] = [
  { icon: dashboardIcon, label: "Dashboard", page: "dashboard" },
  { icon: imgAddShoppingCart, label: "New order", page: "new-order" },
  { icon: imgShoppingCart, label: "My orders", page: "my-orders" },
  { icon: imgBarChart, label: "Campaigns", page: "analytics" },
  { icon: imgBarChart, label: "Candidates", page: "analytics" },
  { icon: imgMediaLibrary, label: "Media library", page: "media-library" },
  { icon: imgUsers, label: "Users", page: "users" },
];

const bottomItems: NavItem[] = [
  { icon: imgSettings, label: "Settings", page: "settings" },
  { icon: imgLogout, label: "Log out", page: "logout" },
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
