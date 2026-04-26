"use client";

import Field from "../Field";
import TextArea from "../TextArea";
import { CONTENT } from "@/lib/content";
import { wordCount } from "@/lib/review";
import type { FormState } from "@/lib/types";

interface StepProps {
  form: FormState;
  set: (k: keyof FormState, v: string) => void;
  errors: Partial<Record<keyof FormState, string>>;
}

export default function StepSolution({ form, set, errors }: StepProps) {
  const f = CONTENT.fields;
  const pc = wordCount(form.problem);
  const sc = wordCount(form.solution);
  return (
    <>
      <Field
        label={f.problem.label}
        counter={{ text: `${pc} words`, over: pc > f.problem.maxWords }}
        help={f.problem.help}
        error={errors.problem}
      >
        <TextArea
          value={form.problem}
          onChange={(v) => set("problem", v)}
          rows={5}
          placeholder={f.problem.placeholder}
          error={errors.problem}
        />
      </Field>
      <Field
        label={f.solution.label}
        counter={{ text: `${sc} words`, over: sc > f.solution.maxWords }}
        help={f.solution.help}
        error={errors.solution}
      >
        <TextArea
          value={form.solution}
          onChange={(v) => set("solution", v)}
          rows={7}
          placeholder={f.solution.placeholder}
          error={errors.solution}
        />
      </Field>
    </>
  );
}
