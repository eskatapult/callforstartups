"use client";

import Field from "../Field";
import TextField from "../TextField";
import { CONTENT } from "@/lib/content";
import type { FormState } from "@/lib/types";

interface StepProps {
  form: FormState;
  set: (k: keyof FormState, v: string) => void;
  setError?: (k: keyof FormState, msg?: string) => void;
  errors: Partial<Record<keyof FormState, string>>;
}

export default function StepContact({ form, set, setError, errors }: StepProps) {
  const f = CONTENT.fields;

  function validateEmail() {
    const v = form.contactEmail.trim();
    if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setError?.("contactEmail", "Enter a valid email address");
    } else {
      setError?.("contactEmail");
    }
  }

  return (
    <>
      <div className="field-row">
        <Field label={f.contactName.label} error={errors.contactName}>
          <TextField
            value={form.contactName}
            onChange={(v) => set("contactName", v)}
            placeholder={f.contactName.placeholder}
            error={errors.contactName}
          />
        </Field>
        <Field label={f.contactRole.label} error={errors.contactRole}>
          <TextField
            value={form.contactRole}
            onChange={(v) => set("contactRole", v)}
            placeholder={f.contactRole.placeholder}
            error={errors.contactRole}
          />
        </Field>
      </div>
      <Field label={f.contactEmail.label} help={f.contactEmail.help} error={errors.contactEmail}>
        <TextField
          type="email"
          value={form.contactEmail}
          onChange={(v) => { set("contactEmail", v); setError?.("contactEmail"); }}
          onBlur={validateEmail}
          placeholder={f.contactEmail.placeholder}
          error={errors.contactEmail}
        />
      </Field>
    </>
  );
}
