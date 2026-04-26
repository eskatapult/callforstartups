"use client";

import Field from "../Field";
import FileUpload from "../FileUpload";
import { CONTENT } from "@/lib/content";
import type { DeckAttachment, FormState } from "@/lib/types";

interface StepDeckProps {
  form: FormState;
  set: (k: "deck", v: DeckAttachment | null) => void;
  errors: Partial<Record<keyof FormState, string>>;
  maxSizeMb?: number;
}

export default function StepDeck({ form, set, errors, maxSizeMb }: StepDeckProps) {
  const f = CONTENT.fields.deck;
  return (
    <>
      <Field label={f.label} help={f.help} error={errors.deck}>
        <FileUpload
          file={form.deck}
          onChange={(v) => set("deck", v)}
          maxSizeMb={maxSizeMb}
          error={errors.deck}
        />
      </Field>
      <div
        style={{
          padding: "16px 18px",
          background: "var(--bg)",
          borderRadius: 4,
          fontSize: 13,
          color: "var(--ink-3)",
          lineHeight: 1.55,
          marginTop: 16,
        }}
      >
        {CONTENT.deckLegal}
      </div>
    </>
  );
}
