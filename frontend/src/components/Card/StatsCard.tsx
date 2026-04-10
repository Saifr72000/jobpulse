import type { FunctionComponent, SVGProps } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Icon from "../Icon/Icon";
import ArrowUpRightIcon from "../../assets/icons/arrow-up-right.svg?react";
import "./StatsCard.scss";

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

interface StatsCardProps {
  icon: SvgComponent;
  label: string;
  value: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export default function StatsCard({
  icon,
  label,
  value,
  isLoading = false,
  onClick,
}: StatsCardProps) {
  return (
    <div className="stats-card">
      <div className="stats-card__icon-box">
        <Icon svg={icon} size={20} />
      </div>
      <p className="stats-card__label">{label}</p>
      <div className="stats-card__footer">
        <span className="stats-card__value">
          {isLoading ? (
            <Skeleton width={80} height={28} borderRadius={6} />
          ) : (
            value
          )}
        </span>
        <button
          className="stats-card__btn"
          onClick={onClick}
          aria-label={`View ${label}`}
        >
          <Icon svg={ArrowUpRightIcon} size={20} />
        </button>
      </div>
    </div>
  );
}
