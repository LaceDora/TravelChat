import { SelectHTMLAttributes } from "react";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

const Select = ({ label, error, options, ...props }: SelectProps) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}

      <select className="form-select" {...props}>
        <option value="">-- Chọn --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default Select;
