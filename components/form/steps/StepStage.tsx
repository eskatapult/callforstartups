"use client";

import Field from "../Field";
import SelectField from "../SelectField";
import { CONTENT, OPTIONS } from "@/lib/content";
import type { FormState } from "@/lib/types";

interface StepProps {
  form: FormState;
  set: (k: keyof FormState, v: string) => void;
  errors: Partial<Record<keyof FormState, string>>;
}

export default function StepStage({ form, set, errors }: StepProps) {
  const f = CONTENT.fields;
  return (
    <div className="field-row-3">
      <Field label={f.stage.label} error={errors.stage}>
        <SelectField
          value={form.stage}
          onChange={(v) => set("stage", v)}
          options={OPTIONS.stages}
          error={errors.stage}
        />
      </Field>
      <Field label={f.teamSize.label} error={errors.teamSize}>
        <SelectField
          value={form.teamSize}
          onChange={(v) => set("teamSize", v)}
          options={OPTIONS.teamSizes}
          error={errors.teamSize}
        />
      </Field>
      <Field label={f.funding.label} error={errors.funding}>
        <SelectField
          value={form.funding}
          onChange={(v) => set("funding", v)}
          options={OPTIONS.fundingBands}
          error={errors.funding}
        />
      </Field>
    </div>
  );
}
