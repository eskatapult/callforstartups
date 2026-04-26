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

export default function StepFramework({ form, set, errors }: StepProps) {
  const f = CONTENT.fields;
  const callout = CONTENT.frameworkCallout;
  const fc = wordCount(form.framework);
  return (
    <>
      <div
        style={{
          padding: "14px 18px",
          background: "var(--bg)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: "0 4px 4px 0",
          marginBottom: 24,
          fontSize: 13.5,
          color: "var(--ink-2)",
          lineHeight: 1.55,
        }}
      >
        <b style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--ink)" }}>
          {callout.title}
        </b>
        <div style={{ marginTop: 6 }}>{callout.body}</div>
      </div>
      <Field
        label={f.framework.label}
        counter={{ text: `${fc} words`, over: fc > f.framework.maxWords }}
        help={f.framework.help}
        error={errors.framework}
      >
        <TextArea
          value={form.framework}
          onChange={(v) => set("framework", v)}
          rows={7}
          placeholder={f.framework.placeholder}
          error={errors.framework}
        />
      </Field>
    </>
  );
}
