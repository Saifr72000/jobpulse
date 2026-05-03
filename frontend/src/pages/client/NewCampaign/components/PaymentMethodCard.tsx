import type { PaymentMethod } from "../types";
import "./PaymentMethodCard.scss";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  selected: boolean;
  icon: React.ReactNode;
  label: string;
  description: string;
  extra?: React.ReactNode;
  onClick: () => void;
}

export function PaymentMethodCard({
  method,
  selected,
  icon,
  label,
  description,
  extra,
  onClick,
}: PaymentMethodCardProps) {
  return (
    <div
      className={`payment-card${selected ? " payment-card--selected" : ""}`}
      data-payment-method={method}
      onClick={onClick}
    >
      <div className="payment-card__icon">{icon}</div>
      <div className="payment-card__content">
        <p className="">{label}</p>
        {description && <p className="payment-card__desc">{description}</p>}
        {extra}
      </div>
      <span
        className={`payment-card__radio${selected ? " payment-card__radio--selected" : ""}`}
      />
    </div>
  );
}
