"use client";

import Field from "../Field";
import TextField from "../TextField";
import SelectField from "../SelectField";
import { CONTENT, OPTIONS } from "@/lib/content";
import type { FormState } from "@/lib/types";

interface StepProps {
  form: FormState;
  set: (k: keyof FormState, v: string) => void;
  errors: Partial<Record<keyof FormState, string>>;
}

export default function StepCompany({ form, set, errors }: StepProps) {
  const f = CONTENT.fields;
  return (
    <>
      <Field label={f.companyName.label} error={errors.companyName}>
        <TextField
          value={form.companyName}
          onChange={(v) => set("companyName", v)}
          placeholder={f.companyName.placeholder}
          error={errors.companyName}
        />
      </Field>
      <div className="field-row">
        <Field label={f.website.label} error={errors.website}>
          <TextField
            type="url"
            value={form.website}
            onChange={(v) => set("website", v)}
            placeholder={f.website.placeholder}
            error={errors.website}
          />
        </Field>
        <Field label={f.country.label} error={errors.country}>
          <SelectField
            value={form.country}
            onChange={(v) => set("country", v)}
            options={OPTIONS.countries}
            error={errors.country}
          />
        </Field>
      </div>
    </>
  );
}
