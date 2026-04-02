import type { Product } from "../types";
import type { FunctionComponent, SVGProps } from "react";
import "./AddonCard.scss";
import Icon from "../../../../components/Icon/Icon";

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement>>;
interface AddonCardProps {
  icon: SvgComponent;
  addon: Product;
  checked: boolean;
  onClick: () => void;
}

export function AddonCard({ addon, checked, icon, onClick }: AddonCardProps) {
  return (
    <div
      className={`addon-card${checked ? " addon-card--checked" : ""}`}
      onClick={onClick}
    >
      <div className="addon-card__header">
        <Icon svg={icon} size={20} />
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
