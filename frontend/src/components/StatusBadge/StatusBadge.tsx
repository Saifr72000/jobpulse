import "./StatusBadge.scss";

export type OrderStatus =
  | "pending"
  | "in-progress"
  | "active"
  | "completed"
  | "awaiting-payment";

interface StatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; modifier: string }> =
  {
    pending: { label: "Pending", modifier: "pending" },
    "in-progress": { label: "In progress", modifier: "in-progress" },
    active: { label: "Active", modifier: "active" },
    completed: { label: "Ended", modifier: "ended" },
    "awaiting-payment": {
      label: "Awaiting payment",
      modifier: "awaiting-payment",
    },
  };

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, modifier } = STATUS_CONFIG[status] ?? {
    label: status,
    modifier: "pending",
  };
  return (
    <span className={`status-badge status-badge--${modifier}`}>{label}</span>
  );
}
