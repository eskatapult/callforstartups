"use client";

interface FieldProps {
  label: string;
  optional?: boolean;
  counter?: { text: string; over: boolean };
  help?: string;
  error?: string;
  children: React.ReactNode;
}

export default function Field({ label, optional, counter, help, error, children }: FieldProps) {
  return (
    <div className="field">
      <label>
        <span>{label}</span>
        <span>
          {counter && (
            <span className={"counter" + (counter.over ? " over" : "")}>{counter.text}</span>
          )}
          {optional && <span className="optional">Optional</span>}
        </span>
      </label>
      {children}
      {help && !error && <div className="field-help">{help}</div>}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}
