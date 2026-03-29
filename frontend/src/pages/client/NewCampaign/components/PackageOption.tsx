import type { Product } from "../types";
import "./PackageOption.scss";

interface PackageOptionProps {
  package: Product;
  selected: boolean;
  popular?: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}

export function PackageOption({
  package: pkg,
  selected,
  popular = false,
  icon,
  onClick,
}: PackageOptionProps) {
  return (
    <div
      className={`package-option${selected ? " package-option--selected" : ""}`}
      onClick={onClick}
    >
      {popular && (
        <span className="package-option__popular">✦ Most popular</span>
      )}
      <div className="package-option__header">
        <div className="package-option__icon">{icon}</div>
        <span className="package-option__name body-2">{pkg.title}</span>
        <span
          className={`package-option__radio${selected ? " package-option__radio--selected" : ""}`}
        />
      </div>
      {pkg.features && pkg.features.length > 0 && (
        <ul className="package-option__features">
          {pkg.features.map((f) => (
            <li key={f} className="package-option__feature">
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
