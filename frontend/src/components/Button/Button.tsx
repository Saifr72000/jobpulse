import type { ReactNode } from "react";
import "./Button.scss";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  onClick,
  children,
  className = "",
}: ButtonProps) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : "",
    loading ? "btn--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {!loading && icon && iconPosition === "left" && (
        <span className="btn__icon">{icon}</span>
      )}
      <span className="btn__label">{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span className="btn__icon">{icon}</span>
      )}
    </button>
  );
}
