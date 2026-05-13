import { useState, useEffect } from "react";
import { useAuth } from "../../../context";
import type { FunctionComponent, SVGProps } from "react";
import { ProfileTab } from "./tabs/ProfileTab";
import { UsersTab } from "./tabs/UsersTab";
/* import { PaymentTab } from "./tabs/PaymentTab"; */
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("settings");
  const isCompanyAdmin = user?.role === "admin";

  useEffect(() => {
    if (activeTab === "users" && !isCompanyAdmin) {
      setActiveTab("settings");
    }
  }, [activeTab, isCompanyAdmin]);

  const visibleTabs = TABS.filter((tab) => tab.id !== "users" || isCompanyAdmin);

  return (
    <div className="settings">
      <div className="page-header">
        <h2>Settings</h2>
        <p className="body-2 text-muted">
          Manage your account settings and preferences
        </p>
      </div>

      <nav className="tab-bar" role="tablist">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
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
        {/* The payment method tab is not yet implemented in backend */}
        {activeTab === "payment" && (
          <div className="settings-card settings__placeholder">
            <p className="body-2 text-muted">Payment methods is coming soon.</p>
          </div>
        )}
        {/* {activeTab === "payment" && <PaymentTab />} */}
        {activeTab === "billing" && (
          <div className="settings-card settings__placeholder">
            <p className="body-2 text-muted">Billing is coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
