"use client";

import Field from "../Field";
import TextField from "../TextField";
import { CONTENT } from "@/lib/content";
import type { FormState } from "@/lib/types";

interface StepProps {
  form: FormState;
  set: (k: keyof FormState, v: string) => void;
  errors: Partial<Record<keyof FormState, string>>;
}

export default function StepContact({ form, set, errors }: StepProps) {
  const f = CONTENT.fields;
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
          onChange={(v) => set("contactEmail", v)}
          placeholder={f.contactEmail.placeholder}
          error={errors.contactEmail}
        />
      </Field>
    </>
  );
}
