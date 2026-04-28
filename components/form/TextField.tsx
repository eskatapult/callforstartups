"use client";

interface TextFieldProps {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: "text" | "email" | "url" | "number";
  error?: string;
}

export default function TextField({
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  error,
}: TextFieldProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className={error ? "error" : ""}
    />
  );
}
