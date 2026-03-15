import "./SuccessModal.scss";

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
  onNavigate: () => void;
}

export function SuccessModal({ show, onClose, onNavigate }: SuccessModalProps) {
  if (!show) return null;

  return (
    <div className="success-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="success-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="success-modal__icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle
              cx="40"
              cy="40"
              r="38"
              stroke="#7151e6"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M24 40l12 12 20-22"
              stroke="#7151e6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="success-modal__title">Campaign submitted</h2>
        <p className="success-modal__body">
          Your campaign order has been successfully placed.
          <br />
          Our team will receive your details and get started right away.
          <br />
          You'll receive a confirmation email shortly.
        </p>
        <button className="success-modal__btn" onClick={onNavigate}>
          View campaign
        </button>
      </div>
    </div>
  );
}
