import "./RadioOption.scss";

interface RadioOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function RadioOption({ label, selected, onClick }: RadioOptionProps) {
  return (
    <div
      className={`radio-option${selected ? " radio-option--selected" : ""}`}
      onClick={onClick}
    >
      <span
        className={`radio-option__dot${selected ? " radio-option__dot--selected" : ""}`}
      />
      <span className="radio-option__label">{label}</span>
    </div>
  );
}
