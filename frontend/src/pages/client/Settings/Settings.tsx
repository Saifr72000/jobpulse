import { useState } from "react";
import type { FunctionComponent, SVGProps } from "react";
import { ProfileTab } from "./tabs/ProfileTab";
import { UsersTab } from "./tabs/UsersTab";
import { PaymentTab } from "./tabs/PaymentTab";
import Icon from "../../../components/Icon/Icon";
import "./Settings.scss";

import CogIcon from "../../../assets/icons/cog.svg?react";
import UsersIcon from "../../../assets/icons/users.svg?react";
import CardIcon from "../../../assets/icons/card.svg?react";
import ReceiptIcon from "../../../assets/icons/receipt.svg?react";

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement>>;
type Tab = "settings" | "users" | "payment" | "billing";

const TABS: { id: Tab; label: string; icon: SvgComponent }[] = [
  { id: "settings", label: "Settings", icon: CogIcon },
  { id: "users", label: "Users", icon: UsersIcon },
  { id: "payment", label: "Payment methods", icon: CardIcon },
  { id: "billing", label: "Billing", icon: ReceiptIcon },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("settings");

  return (
    <div className="settings">
      <div className="page-header">
        <h2>Settings</h2>
        <p className="body-2 text-muted">Manage your account settings and preferences</p>
      </div>

      <nav className="settings__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`settings__tab${activeTab === tab.id ? " settings__tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon svg={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="settings__content">
        {activeTab === "settings" && <ProfileTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "payment" && <PaymentTab />}
        {activeTab === "billing" && (
          <div className="settings-card settings__placeholder">
            <p className="body-2 text-muted">Billing is coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
