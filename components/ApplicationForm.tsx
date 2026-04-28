"use client";

import { useState, useEffect, useMemo } from "react";
import Stepper from "./Stepper";
import ReviewModal from "./ReviewModal";
import StepContact from "./form/steps/StepContact";
import StepCompany from "./form/steps/StepCompany";
import StepStage from "./form/steps/StepStage";
import StepSolution from "./form/steps/StepSolution";
import StepFramework from "./form/steps/StepFramework";
import StepDeck from "./form/steps/StepDeck";
import { CONTENT, DEMO_DATA } from "@/lib/content";
import { heuristicReview, wordCount, basicChecks, STRICTNESS } from "@/lib/review";
import type {
  ClientConfig,
  FormState,
  DeckAttachment,
  ReviewState,
  ReviewResult,
} from "@/lib/types";

const STORAGE_FORM = "foodcall.form";
const STORAGE_STEP = "foodcall.step";

const EMPTY_FORM: FormState = {
  contactName: "",
  contactEmail: "",
  contactRole: "",
  companyName: "",
  website: "",
  country: "",
  stage: "",
  teamSize: "",
  funding: "",
  problem: "",
  solution: "",
  framework: "",
  deck: null,
};

type StepId = (typeof CONTENT.steps)[number]["id"];

// Shared props for text-field steps (Contact, Company, Stage, Solution, Framework)
interface StepProps {
  form: FormState;
  set: (k: keyof FormState, v: string) => void;
  setError?: (k: keyof FormState, msg?: string) => void;
  errors: Partial<Record<keyof FormState, string>>;
}

type TextStepId = Exclude<StepId, "deck">;

const STEP_COMPONENTS: Record<TextStepId, React.ComponentType<StepProps>> = {
  contact: StepContact,
  company: StepCompany,
  stage: StepStage,
  solution: StepSolution,
  framework: StepFramework,
};

function loadPersistedForm(): FormState {
  try {
    const raw = localStorage.getItem(STORAGE_FORM);
    if (!raw) return EMPTY_FORM;
    const parsed = JSON.parse(raw);
    // deck.file can't survive serialization — keep metadata for display only
    if (parsed.deck) parsed.deck = { ...parsed.deck, file: null };
    return { ...EMPTY_FORM, ...parsed };
  } catch {
    return EMPTY_FORM;
  }
}

function persistForm(form: FormState) {
  try {
    // Exclude the File object — not serializable
    const toStore = {
      ...form,
      deck: form.deck ? { name: form.deck.name, size: form.deck.size, type: form.deck.type } : null,
    };
    localStorage.setItem(STORAGE_FORM, JSON.stringify(toStore));
  } catch {}
}

interface Props {
  config: ClientConfig;
}

export default function ApplicationForm({ config }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [current, setCurrent] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [reviewState, setReviewState] = useState<ReviewState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    const savedForm = loadPersistedForm();
    const savedStep = parseInt(localStorage.getItem(STORAGE_STEP) ?? "0", 10);
    setForm(savedForm);
    setCurrent(Math.min(savedStep, CONTENT.steps.length - 1));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistForm(form);
  }, [form, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_STEP, String(current));
  }, [current, hydrated]);

  const set = (k: keyof FormState, v: string | DeckAttachment | null) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const setTextField = (k: keyof FormState, v: string) => set(k, v);
  const setDeck = (k: "deck", v: DeckAttachment | null) => set(k, v);

  const setError = (k: keyof FormState, msg?: string) => {
    setErrors((e) => {
      if (!msg) {
        const next = { ...e };
        delete next[k];
        return next;
      }
      return { ...e, [k]: msg };
    });
  };

  const completed = useMemo(() => ({
    contact: !!(form.contactName && form.contactEmail && form.contactRole),
    company: !!(form.companyName && form.website && form.country),
    stage: !!(form.stage && form.teamSize && form.funding),
    solution: wordCount(form.problem) >= 15 && wordCount(form.solution) >= 20,
    framework: wordCount(form.framework) >= 15,
    deck: !!form.deck?.file,
  }), [form]);

  const totalDone = Object.values(completed).filter(Boolean).length;
  const progress = (totalDone / CONTENT.steps.length) * 100;

  function goto(i: number) {
    setCurrent(Math.max(0, Math.min(CONTENT.steps.length - 1, i)));
    const el = document.querySelector<HTMLElement>(".form-wrap");
    if (el) window.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
  }

  async function handleReview() {
    // Collect inline errors for missing required fields
    const strict = STRICTNESS[config.reviewStrictness];
    const basic = basicChecks(form, strict);
    const fieldMap: Record<string, keyof FormState> = {
      "Contact name": "contactName",
      "Contact email": "contactEmail",
      "Role / title": "contactRole",
      "Company name": "companyName",
      "Website": "website",
      "Country": "country",
      "Stage": "stage",
      "Team size": "teamSize",
      "Funding raised": "funding",
      "Problem statement": "problem",
      "Solution": "solution",
      "EAT framework alignment": "framework",
      "Pitch deck": "deck",
    };
    const errs: Partial<Record<keyof FormState, string>> = {};
    for (const flag of basic) {
      const k = fieldMap[flag.field];
      if (k && flag.kind === "missing") errs[k] = flag.msg;
    }
    setErrors(errs);

    setReviewState({ loading: true, status: "Checking required fields…" });

    let result: ReviewResult;

    if (config.reviewMode === "api") {
      setTimeout(() => setReviewState({ loading: true, status: "Reading problem & solution…" }), 700);
      setTimeout(() => setReviewState({ loading: true, status: "Scoring framework alignment…" }), 1500);

      try {
        const res = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form, strictness: config.reviewStrictness }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        result = await res.json();
      } catch {
        // Fall back to heuristic if API fails
        result = heuristicReview(form, config.reviewStrictness);
      }
    } else {
      // Small delay so the loading state is visible
      await new Promise((r) => setTimeout(r, 600));
      result = heuristicReview(form, config.reviewStrictness);
    }

    setReviewState({ result });
  }

  async function handleConfirmSubmit() {
    if (!("result" in (reviewState ?? {}))) return;

    const result = (reviewState as { result: ReviewResult }).result;

    const fd = new FormData();
    fd.append(
      "application",
      JSON.stringify({
        ...form,
        deck: form.deck ? { name: form.deck.name, size: form.deck.size, type: form.deck.type } : null,
        reviewScore: result.score,
      })
    );
    if (form.deck?.file) {
      fd.append("deck", form.deck.file, form.deck.name);
    }

    try {
      const res = await fetch("/api/submit", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Submit failed: HTTP ${res.status}`);
      const { ref } = await res.json();
      const time = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setReviewState({ submitted: true, ref, score: result.score, time });
      // Clear persisted form on successful submission
      localStorage.removeItem(STORAGE_FORM);
      localStorage.removeItem(STORAGE_STEP);
    } catch (err) {
      alert(`Submission failed. Please try again.\n${err instanceof Error ? err.message : ""}`);
    }
  }

  const steps = CONTENT.steps;
  const stepId = steps[current].id;
  const StepComp = stepId !== "deck" ? STEP_COMPONENTS[stepId as TextStepId] : null;
  const isLast = current === steps.length - 1;
  const panel = CONTENT.stepPanels[stepId];
  const { backButton, continueButton, reviewButton, demoButton, resetButton } = CONTENT.form;

  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginBottom: 24,
          maxWidth: 1080,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <button
          className="btn btn-ghost"
          style={{ padding: "8px 16px", fontSize: 12 }}
          onClick={() => { setForm({ ...EMPTY_FORM, ...DEMO_DATA }); setErrors({}); }}
        >
          {demoButton}
        </button>
        <button
          className="btn btn-ghost"
          style={{ padding: "8px 16px", fontSize: 12 }}
          onClick={() => { setForm(EMPTY_FORM); setCurrent(0); setErrors({}); setReviewState(null); }}
        >
          {resetButton}
        </button>
      </div>

      <div className="form-wrap">
        <Stepper
          current={current}
          completed={completed}
          progress={progress}
          onJump={goto}
        />

        <div className="panel" data-step={stepId}>
          <div className="panel-head">
            <div className="panel-num">
              Section {steps[current].num} — {steps[current].label}
            </div>
            <h2>{panel.title}</h2>
            <p>{panel.sub}</p>
          </div>

          {stepId === "deck" || !StepComp ? (
            <StepDeck
              form={form}
              set={setDeck}
              errors={errors}
              maxDeckSizeMb={config.maxDeckSizeMb}
            />
          ) : (
            <StepComp form={form} set={setTextField} setError={setError} errors={errors} />
          )}

          <div className="panel-foot">
            <button
              className="btn btn-ghost"
              onClick={() => goto(current - 1)}
              disabled={current === 0}
            >
              {backButton}
            </button>
            {isLast ? (
              <button className="btn btn-submit" onClick={handleReview}>
                {reviewButton}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => goto(current + 1)}>
                {continueButton}
              </button>
            )}
          </div>
        </div>
      </div>

      <ReviewModal
        state={reviewState}
        onClose={() => setReviewState(null)}
        onRevise={() => setReviewState(null)}
        onConfirmSubmit={handleConfirmSubmit}
        onDone={() => {
          setForm(EMPTY_FORM);
          setCurrent(0);
          setErrors({});
          setReviewState(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </section>
  );
}
