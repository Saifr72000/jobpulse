import "./InputField.scss";
import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function InputField({ label, error, id, className, ...props }: InputFieldProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="input-field">
      {label && (
        <label className="input-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field__input${error ? " input-field__input--error" : ""}${className ? ` ${className}` : ""}`}
        {...props}
      />
      {error && <span className="input-field__error">{error}</span>}
    </div>
  );
}
