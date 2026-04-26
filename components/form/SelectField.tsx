"use client";

interface SelectFieldProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
}

export default function SelectField({ value, onChange, options, error }: SelectFieldProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={error ? "error" : ""}
    >
      {options.map((opt, i) => (
        <option key={i} value={i === 0 && opt.startsWith("Select") ? "" : opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
