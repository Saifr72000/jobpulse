import type { Addon } from "../types";
import "./AddonCard.scss";

interface AddonCardProps {
  addon: Addon;
  checked: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}

export function AddonCard({ addon, checked, icon, onClick }: AddonCardProps) {
  return (
    <div
      className={`addon-card${checked ? " addon-card--checked" : ""}`}
      onClick={onClick}
    >
      <div className="addon-card__header">
        <div className="addon-card__icon-wrap">{icon}</div>
        <span
          className={`addon-card__check${checked ? " addon-card__check--checked" : ""}`}
        >
          {checked && "✓"}
        </span>
      </div>
      <p className="addon-card__name body-2">{addon.title}</p>
      <p className="body-2">{addon.description}</p>
      <p className="addon-card__price">
        {addon.price.toLocaleString("nb-NO")} kr
      </p>
    </div>
  );
}
