import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}

      <input className="form-input" {...props} />

      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default Input;
