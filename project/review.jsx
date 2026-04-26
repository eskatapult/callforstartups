// LLM-powered review logic
const STRICTNESS = {
  lenient:  { threshold: 55, minWords: { problem: 20, solution: 30, framework: 25 } },
  standard: { threshold: 70, minWords: { problem: 40, solution: 60, framework: 50 } },
  strict:   { threshold: 82, minWords: { problem: 60, solution: 90, framework: 75 } },
};

function wordCount(s) {
  if (!s) return 0;
  return s.trim().split(/\s+/).filter(Boolean).length;
}

// Deterministic field-level checks, run regardless of LLM availability
function basicChecks(form, strict) {
  const flags = [];
  const req = {
    contactName: "Contact name",
    contactEmail: "Contact email",
    contactRole: "Role / title",
    companyName: "Company name",
    website: "Website",
    country: "Country",
    stage: "Stage",
    teamSize: "Team size",
    funding: "Funding raised",
    problem: "Problem statement",
    solution: "Solution",
    framework: "EAT framework alignment",
  };
  for (const [k, label] of Object.entries(req)) {
    if (!form[k] || !String(form[k]).trim()) {
      flags.push({ field: label, kind: "missing", msg: `${label} is missing.` });
    }
  }
  if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
    flags.push({ field: "Contact email", kind: "weak", msg: "That doesn't look like a valid email address." });
  }
  if (form.website && !/^https?:\/\/.+\..+/.test(form.website) && !/^[\w-]+\.[a-z]{2,}/i.test(form.website)) {
    flags.push({ field: "Website", kind: "weak", msg: "Include a working URL (e.g. https://yourco.com)." });
  }
  if (!form.deck) {
    flags.push({ field: "Pitch deck", kind: "missing", msg: "A pitch deck is required for evaluation." });
  }
  const mins = strict.minWords;
  if (form.problem && wordCount(form.problem) < mins.problem) {
    flags.push({ field: "Problem statement", kind: "weak", msg: `Too short — aim for at least ${mins.problem} words to give context.` });
  }
  if (form.solution && wordCount(form.solution) < mins.solution) {
    flags.push({ field: "Solution", kind: "weak", msg: `Too short — describe the technology, how it works, and what's validated. Aim for ${mins.solution}+ words.` });
  }
  if (form.framework && wordCount(form.framework) < mins.framework) {
    flags.push({ field: "EAT alignment", kind: "weak", msg: `Too brief — connect your solution to specific guardrails in EAT Lancet 2.0. Aim for ${mins.framework}+ words.` });
  }
  return flags;
}

// Ask Claude to assess the three long-form answers for specificity and fit.
async function llmReview(form, strictness) {
  const prompt = `You are an expert startup application reviewer for the EAT × Katapult × Norrsken Global Call for Startups. Evaluate the submission below against these criteria (Impact, Innovation, Technology, Business Stage, Customer, Team, Benefit from Support). The framework is based on EAT Lancet 2.0 — healthy, sustainable, socially just food systems.

Strictness: ${strictness}. Lenient = encourage anyone with a serious attempt. Standard = expect specifics and evidence. Strict = demand quantified traction, named tech, validated claims.

Submission:
- Company: ${form.companyName}
- Stage: ${form.stage}
- Problem: ${form.problem}
- Solution: ${form.solution}
- EAT alignment: ${form.framework}

Return STRICT JSON only, no markdown, this shape:
{
  "score": <integer 0-100, how complete & compelling this application is>,
  "summary": "<2 sentences, editorial tone, what stood out and what's missing>",
  "flags": [
    {"field": "Problem statement" | "Solution" | "EAT alignment" | "Overall", "kind": "ok" | "weak" | "missing", "msg": "<short observation>", "suggestion": "<concrete rewrite or question to answer, optional>"}
  ]
}

Be specific. If something is vague ("we use AI", "sustainable food") flag it. If strong, say so with kind:"ok".`;

  try {
    const text = await window.claude.complete(prompt);
    // Extract JSON
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("no json");
    const parsed = JSON.parse(match[0]);
    return parsed;
  } catch (e) {
    // Fallback heuristic review so prototype always works
    return fallbackReview(form, strictness);
  }
}

function fallbackReview(form, strictness) {
  const wcP = wordCount(form.problem);
  const wcS = wordCount(form.solution);
  const wcF = wordCount(form.framework);
  const vague = /(we use ai|sustainable|innovative|disruptive|revolutionary|leverage)/i;
  const flags = [];
  let score = 50;

  if (wcP >= 40) { score += 10; flags.push({ field: "Problem statement", kind: "ok", msg: "Problem is clearly framed with scope." }); }
  else flags.push({ field: "Problem statement", kind: "weak", msg: "Short — who exactly suffers, at what scale?", suggestion: "Add a data point: how many people, how much food, what cost." });

  if (wcS >= 60 && !vague.test(form.solution || "")) { score += 15; flags.push({ field: "Solution", kind: "ok", msg: "Technology and mechanism are specific." }); }
  else flags.push({ field: "Solution", kind: "weak", msg: "Explain the technology concretely — what's validated, where, with whom.", suggestion: "Name the tech (enzymatic process, fermentation strain, ML model) and one piece of evidence it works." });

  if (wcF >= 50) { score += 15; flags.push({ field: "EAT alignment", kind: "ok", msg: "Connection to EAT Lancet framework is articulated." }); }
  else flags.push({ field: "EAT alignment", kind: "weak", msg: "Tie directly to a guardrail: planetary health diet, GHG budget, biodiversity, etc.", suggestion: "Which specific EAT Lancet 2.0 boundary does your solution move, and by how much at scale?" });

  score += Math.min(10, Math.round((wcP + wcS + wcF) / 30));
  return {
    score: Math.min(92, score),
    summary: score >= STRICTNESS[strictness].threshold
      ? "The submission reads as a serious application with concrete framing. A reviewer would have enough to evaluate."
      : "The core is visible but key answers need more specificity — particularly on what's been validated and how your innovation aligns with EAT Lancet 2.0 guardrails.",
    flags,
  };
}

async function runReview(form, strictnessKey) {
  const strict = STRICTNESS[strictnessKey];
  const basic = basicChecks(form, strict);

  // If there are missing required fields, short-circuit with a low score.
  const missing = basic.filter(f => f.kind === "missing");
  if (missing.length > 0) {
    return {
      score: Math.max(15, 50 - missing.length * 6),
      summary: `${missing.length} required field${missing.length > 1 ? "s are" : " is"} still empty. Complete them before we can review the substantive answers.`,
      flags: basic,
      threshold: strict.threshold,
      passed: false,
    };
  }

  const llm = await llmReview(form, strictnessKey);
  // Merge deterministic weak flags with LLM flags, avoid duplicates by field
  const seen = new Set(llm.flags.map(f => f.field.toLowerCase()));
  const merged = [...llm.flags];
  for (const b of basic) {
    if (!seen.has(b.field.toLowerCase())) merged.push(b);
  }
  return {
    score: llm.score,
    summary: llm.summary,
    flags: merged,
    threshold: strict.threshold,
    passed: llm.score >= strict.threshold,
  };
}

function ReviewModal({ state, onClose, onRevise, onConfirmSubmit }) {
  if (!state) return null;
  if (state.loading) {
    return (
      <div className="overlay">
        <div className="review-card">
          <div className="review-analyzing">
            <div className="pulse" />
            <h3>Reviewing your application</h3>
            <p>We're checking completeness and giving you feedback before it goes to the partners.</p>
            <div className="status">{state.status || "Analyzing answers…"}</div>
          </div>
        </div>
      </div>
    );
  }
  if (state.submitted) {
    return (
      <div className="overlay">
        <div className="review-card">
          <div className="submitted">
            <div className="submitted-mark">✓</div>
            <h3>Application received</h3>
            <p>
              Thank you. Your submission has been logged and shared with the review panel at Katapult and Norrsken.
              You'll hear from us within four weeks.
            </p>
            <div className="submitted-meta">
              <span>Ref <b>{state.ref}</b></span>
              <span>Score <b>{state.score}/100</b></span>
              <span>Submitted <b>{state.time}</b></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const { result } = state;
  const verdictKind = result.passed ? "pass" : (result.score >= result.threshold - 15 ? "warn" : "fail");
  const verdictLabel = result.passed ? "Ready to submit" : (verdictKind === "warn" ? "Almost there" : "Needs work");
  return (
    <div className="overlay">
      <div className="review-card">
        <div className="review-head">
          <div className="review-eyebrow">Pre-submission review</div>
          <div className="review-verdict">
            <div className="verdict-score">{result.score}<small>/100</small></div>
            <div className="verdict-text">
              <span className={"verdict-pill " + verdictKind}>{verdictLabel}</span>
              <h3>{result.passed ? "Your application clears the bar." : "A few things to strengthen."}</h3>
              <p>Threshold for this strictness level: {result.threshold}/100.</p>
            </div>
          </div>
        </div>
        <div className="review-body">
          <div className="review-summary">{result.summary}</div>
          {result.flags.map((f, i) => (
            <div className="flag" key={i} data-kind={f.kind}>
              <div className="flag-icon">{f.kind === "ok" ? "✓" : f.kind === "missing" ? "✕" : "!"}</div>
              <div>
                <div className="flag-field">{f.field}</div>
                <div className="flag-msg">{f.msg}</div>
                {f.suggestion && <div className="flag-suggestion">Suggested: {f.suggestion}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="review-foot">
          <button className="btn btn-ghost" onClick={onRevise}>Back to edit</button>
          {result.passed
            ? <button className="btn btn-primary" onClick={onConfirmSubmit}>Submit application →</button>
            : <button className="btn btn-ghost" onClick={onConfirmSubmit} title="Submit anyway">Submit anyway</button>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { STRICTNESS, wordCount, basicChecks, runReview, ReviewModal });
