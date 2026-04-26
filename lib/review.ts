import type { FormState, ReviewFlag, ReviewResult, ReviewStrictness } from "./types";

export interface StrictnessConfig {
  threshold: number;
  minWords: { problem: number; solution: number; framework: number };
}

export const STRICTNESS: Record<ReviewStrictness, StrictnessConfig> = {
  lenient: { threshold: 55, minWords: { problem: 20, solution: 30, framework: 25 } },
  standard: { threshold: 70, minWords: { problem: 40, solution: 60, framework: 50 } },
  strict: { threshold: 82, minWords: { problem: 60, solution: 90, framework: 75 } },
};

export function wordCount(s: string | undefined | null): number {
  if (!s) return 0;
  return s.trim().split(/\s+/).filter(Boolean).length;
}

// Field-level deterministic checks — run regardless of review mode.
export function basicChecks(form: FormState, strict: StrictnessConfig): ReviewFlag[] {
  const flags: ReviewFlag[] = [];

  const required: [keyof FormState, string][] = [
    ["contactName", "Contact name"],
    ["contactEmail", "Contact email"],
    ["contactRole", "Role / title"],
    ["companyName", "Company name"],
    ["website", "Website"],
    ["country", "Country"],
    ["stage", "Stage"],
    ["teamSize", "Team size"],
    ["funding", "Funding raised"],
    ["problem", "Problem statement"],
    ["solution", "Solution"],
    ["framework", "EAT framework alignment"],
  ];

  for (const [k, label] of required) {
    const v = form[k];
    if (!v || !String(v).trim()) {
      flags.push({ field: label, kind: "missing", msg: `${label} is missing.` });
    }
  }

  if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
    flags.push({
      field: "Contact email",
      kind: "weak",
      msg: "That doesn't look like a valid email address.",
    });
  }

  if (
    form.website &&
    !/^https?:\/\/.+\..+/.test(form.website) &&
    !/^[\w-]+\.[a-z]{2,}/i.test(form.website)
  ) {
    flags.push({
      field: "Website",
      kind: "weak",
      msg: "Include a working URL (e.g. https://yourco.com).",
    });
  }

  if (!form.deck?.file) {
    flags.push({
      field: "Pitch deck",
      kind: "missing",
      msg: "A pitch deck is required for evaluation.",
    });
  }

  const mins = strict.minWords;
  if (form.problem && wordCount(form.problem) < mins.problem) {
    flags.push({
      field: "Problem statement",
      kind: "weak",
      msg: `Too short — aim for at least ${mins.problem} words to give context.`,
    });
  }
  if (form.solution && wordCount(form.solution) < mins.solution) {
    flags.push({
      field: "Solution",
      kind: "weak",
      msg: `Too short — describe the technology, how it works, and what's validated. Aim for ${mins.solution}+ words.`,
    });
  }
  if (form.framework && wordCount(form.framework) < mins.framework) {
    flags.push({
      field: "EAT alignment",
      kind: "weak",
      msg: `Too brief — connect your solution to specific guardrails in EAT Lancet 2.0. Aim for ${mins.framework}+ words.`,
    });
  }

  return flags;
}

// Heuristic review — runs in the browser with no API call.
export function heuristicReview(form: FormState, strictnessKey: ReviewStrictness): ReviewResult {
  const strict = STRICTNESS[strictnessKey];
  const basic = basicChecks(form, strict);
  const missing = basic.filter((f) => f.kind === "missing");

  if (missing.length > 0) {
    return {
      score: Math.max(15, 50 - missing.length * 6),
      summary: `${missing.length} required field${missing.length > 1 ? "s are" : " is"} still empty. Complete them before we can review the substantive answers.`,
      flags: basic,
      threshold: strict.threshold,
      passed: false,
    };
  }

  const wcP = wordCount(form.problem);
  const wcS = wordCount(form.solution);
  const wcF = wordCount(form.framework);
  const vaguePattern = /(we use ai|sustainable|innovative|disruptive|revolutionary|leverage)/i;
  const flags: ReviewFlag[] = [];
  let score = 50;

  if (wcP >= 40) {
    score += 10;
    flags.push({ field: "Problem statement", kind: "ok", msg: "Problem is clearly framed with scope." });
  } else {
    flags.push({
      field: "Problem statement",
      kind: "weak",
      msg: "Short — who exactly suffers, at what scale?",
      suggestion: "Add a data point: how many people, how much food, what cost.",
    });
  }

  if (wcS >= 60 && !vaguePattern.test(form.solution || "")) {
    score += 15;
    flags.push({ field: "Solution", kind: "ok", msg: "Technology and mechanism are specific." });
  } else {
    flags.push({
      field: "Solution",
      kind: "weak",
      msg: "Explain the technology concretely — what's validated, where, with whom.",
      suggestion:
        "Name the tech (enzymatic process, fermentation strain, ML model) and one piece of evidence it works.",
    });
  }

  if (wcF >= 50) {
    score += 15;
    flags.push({ field: "EAT alignment", kind: "ok", msg: "Connection to EAT Lancet framework is articulated." });
  } else {
    flags.push({
      field: "EAT alignment",
      kind: "weak",
      msg: "Tie directly to a guardrail: planetary health diet, GHG budget, biodiversity, etc.",
      suggestion:
        "Which specific EAT Lancet 2.0 boundary does your solution move, and by how much at scale?",
    });
  }

  score += Math.min(10, Math.round((wcP + wcS + wcF) / 30));
  const finalScore = Math.min(92, score);

  return {
    score: finalScore,
    summary:
      finalScore >= strict.threshold
        ? "The submission reads as a serious application with concrete framing. A reviewer would have enough to evaluate."
        : "The core is visible but key answers need more specificity — particularly on what's been validated and how your innovation aligns with EAT Lancet 2.0 guardrails.",
    flags,
    threshold: strict.threshold,
    passed: finalScore >= strict.threshold,
  };
}
