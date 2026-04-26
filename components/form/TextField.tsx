"use client";

interface TextFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "url" | "number";
  error?: string;
}

export default function TextField({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: TextFieldProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={error ? "error" : ""}
    />
  );
}
