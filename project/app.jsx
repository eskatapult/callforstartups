// Main app: state, steps, orchestration
const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "neutral",
  "layout": "stepped",
  "strictness": "standard",
  "variant": "panel"
}/*EDITMODE-END*/;

const EMPTY_FORM = {
  contactName: "", contactEmail: "", contactRole: "",
  companyName: "", website: "", country: "",
  stage: "", teamSize: "", funding: "",
  problem: "", solution: "", framework: "",
  deck: null,
};

// Demo pre-fill so the prototype feels alive — click "Fill demo"
const DEMO_FORM = {
  contactName: "Lina Bergström",
  contactEmail: "lina@mycelia.bio",
  contactRole: "Co-founder & CEO",
  companyName: "Mycelia Bio",
  website: "https://mycelia.bio",
  country: "Sweden",
  stage: "Seed",
  teamSize: "6-10",
  funding: "$1M–$5M",
  problem: "Global pork production emits over 800 Mt CO₂e annually and relies on soy feed that drives 40% of Amazon deforestation. Smallholder farmers in Southeast Asia, where 60% of global pork is consumed, lack access to feed alternatives that are both affordable and protein-dense.",
  solution: "We ferment agricultural side-streams using a proprietary Aspergillus strain (patent pending, EU application 23158972) to produce a protein ingredient with 62% crude protein content and 94% digestibility — benchmarked against fishmeal. Validated in two 8-week pig trials at SLU Uppsala with 8% better feed-conversion ratio. Current production cost is €1.40/kg at pilot scale; we hit price-parity with soy at 500-ton annual throughput.",
  framework: "Our ingredient displaces soy and fishmeal — two of the largest drivers of land-use change and ocean depletion flagged in EAT Lancet. By substituting 20% of European pig feed we would cut 18 Mt CO₂e and spare ~2.4M hectares of land annually, directly pulling two planetary-boundary indicators (biosphere integrity, land-system change) back toward safe operating space.",
  deck: { name: "Mycelia_Bio_SeriesA_Deck_v7.pdf", size: 4_820_000, type: "application/pdf" },
};

function StepContact({ form, set, errors }) {
  return (
    <>
      <div className="field-row">
        <Field label="Full name" error={errors.contactName}>
          <TextField value={form.contactName} onChange={v => set("contactName", v)} placeholder="Jane Doe" error={errors.contactName} />
        </Field>
        <Field label="Role / title" error={errors.contactRole}>
          <TextField value={form.contactRole} onChange={v => set("contactRole", v)} placeholder="Co-founder & CEO" error={errors.contactRole} />
        </Field>
      </div>
      <Field label="Work email" help="We'll send all review communications here." error={errors.contactEmail}>
        <TextField type="email" value={form.contactEmail} onChange={v => set("contactEmail", v)} placeholder="jane@yourco.com" error={errors.contactEmail} />
      </Field>
    </>
  );
}

function StepCompany({ form, set, errors }) {
  return (
    <>
      <Field label="Company name" error={errors.companyName}>
        <TextField value={form.companyName} onChange={v => set("companyName", v)} placeholder="Your company" error={errors.companyName} />
      </Field>
      <div className="field-row">
        <Field label="Website" error={errors.website}>
          <TextField type="url" value={form.website} onChange={v => set("website", v)} placeholder="https://yourco.com" error={errors.website} />
        </Field>
        <Field label="HQ country" error={errors.country}>
          <Select value={form.country} onChange={v => set("country", v)} options={COUNTRIES} error={errors.country} />
        </Field>
      </div>
    </>
  );
}

function StepStage({ form, set, errors }) {
  return (
    <>
      <div className="field-row-3">
        <Field label="Current stage" error={errors.stage}>
          <Select value={form.stage} onChange={v => set("stage", v)} options={["Select stage…", ...STAGES]} error={errors.stage} />
        </Field>
        <Field label="Team size" error={errors.teamSize}>
          <Select value={form.teamSize} onChange={v => set("teamSize", v)} options={["Select…", ...TEAM_SIZES]} error={errors.teamSize} />
        </Field>
        <Field label="Funding raised" error={errors.funding}>
          <Select value={form.funding} onChange={v => set("funding", v)} options={["Select band…", ...FUNDING_BANDS]} error={errors.funding} />
        </Field>
      </div>
    </>
  );
}

function StepSolution({ form, set, errors }) {
  const pc = wordCount(form.problem);
  const sc = wordCount(form.solution);
  return (
    <>
      <Field
        label="The problem you're solving"
        counter={{ text: `${pc} words`, over: pc > 180 }}
        help="Describe who suffers, at what scale, and why existing solutions fall short. Include a data point."
        error={errors.problem}
      >
        <TextArea value={form.problem} onChange={v => set("problem", v)} rows={5}
          placeholder="E.g. Global pork production emits 800 Mt CO₂e annually…" error={errors.problem} />
      </Field>
      <Field
        label="Your solution"
        counter={{ text: `${sc} words`, over: sc > 260 }}
        help="Be specific about the technology, evidence it works, and current stage of validation."
        error={errors.solution}
      >
        <TextArea value={form.solution} onChange={v => set("solution", v)} rows={7}
          placeholder="Name the tech, the mechanism, the data." error={errors.solution} />
      </Field>
    </>
  );
}

function StepFramework({ form, set, errors }) {
  const fc = wordCount(form.framework);
  return (
    <>
      <div style={{ padding: "14px 18px", background: "var(--bg)", borderLeft: "3px solid var(--accent)", borderRadius: "0 4px 4px 0", marginBottom: 24, fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
        <b style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--ink)" }}>EAT Lancet 2.0 framework</b>
        <div style={{ marginTop: 6 }}>
          Your solution should move one or more planetary-health boundaries — GHG emissions, land-system change,
          biosphere integrity, nitrogen & phosphorus flows, freshwater use — while supporting a healthy, socially just diet.
        </div>
      </div>
      <Field
        label="How does your innovation align with the EAT Lancet scientific framework?"
        counter={{ text: `${fc} words`, over: fc > 240 }}
        help="Reference the specific guardrails you move. Quantify if you can."
        error={errors.framework}
      >
        <TextArea value={form.framework} onChange={v => set("framework", v)} rows={7}
          placeholder="Our ingredient displaces soy and fishmeal — two drivers of land-use change flagged in EAT Lancet…" error={errors.framework} />
      </Field>
    </>
  );
}

function StepDeck({ form, set, errors }) {
  return (
    <>
      <Field label="Pitch deck" help="The deck should cover: problem, solution, tech validation, team, traction, ask. 10–20 slides." error={errors.deck}>
        <FileUpload file={form.deck} onChange={v => set("deck", v)} error={errors.deck} />
      </Field>
      <div style={{ padding: "16px 18px", background: "var(--bg)", borderRadius: 4, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, marginTop: 16 }}>
        By submitting you confirm you have rights to all materials included and consent to evaluation by
        Katapult, Norrsken, and their review partners under the EAT Foundation scientific framework.
      </div>
    </>
  );
}

const STEP_COMPONENTS = { contact: StepContact, company: StepCompany, stage: StepStage, solution: StepSolution, framework: StepFramework, deck: StepDeck };

function App() {
  const [tweaks, setTweaks] = useStateA(() => {
    try { return { ...TWEAK_DEFAULTS, ...JSON.parse(localStorage.getItem("foodcall.tweaks") || "{}") }; }
    catch { return TWEAK_DEFAULTS; }
  });
  const [tweaksVisible, setTweaksVisible] = useStateA(false);
  const [form, setForm] = useStateA(() => {
    try { return { ...EMPTY_FORM, ...JSON.parse(localStorage.getItem("foodcall.form") || "{}") }; }
    catch { return EMPTY_FORM; }
  });
  const [current, setCurrent] = useStateA(() => parseInt(localStorage.getItem("foodcall.step") || "0", 10));
  const [errors, setErrors] = useStateA({});
  const [reviewState, setReviewState] = useStateA(null);

  useEffectA(() => {
    document.body.dataset.theme = tweaks.theme;
    document.body.dataset.variant = tweaks.variant;
    localStorage.setItem("foodcall.tweaks", JSON.stringify(tweaks));
  }, [tweaks]);
  useEffectA(() => { localStorage.setItem("foodcall.form", JSON.stringify(form)); }, [form]);
  useEffectA(() => { localStorage.setItem("foodcall.step", String(current)); }, [current]);

  // Tweaks protocol
  useEffectA(() => {
    const handler = (e) => {
      if (!e?.data?.type) return;
      if (e.data.type === "__activate_edit_mode") setTweaksVisible(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksVisible(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);
  useEffectA(() => {
    if (!tweaksVisible) return;
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: tweaks }, "*");
  }, [tweaks, tweaksVisible]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Step completion logic (for ticks)
  const completed = useMemoA(() => {
    const c = {};
    c.contact = form.contactName && form.contactEmail && form.contactRole;
    c.company = form.companyName && form.website && form.country;
    c.stage = form.stage && form.teamSize && form.funding;
    c.solution = wordCount(form.problem) >= 15 && wordCount(form.solution) >= 20;
    c.framework = wordCount(form.framework) >= 15;
    c.deck = !!form.deck;
    return c;
  }, [form]);

  const totalDone = Object.values(completed).filter(Boolean).length;
  const progress = (totalDone / STEPS.length) * 100;

  const goto = (i) => {
    setCurrent(Math.max(0, Math.min(STEPS.length - 1, i)));
    window.scrollTo({ top: document.querySelector(".form-wrap")?.offsetTop - 20 || 0, behavior: "smooth" });
  };

  const handleReview = async () => {
    const errs = {};
    const strict = STRICTNESS[tweaks.strictness];
    const basic = basicChecks(form, strict);
    for (const b of basic) {
      // Map friendly field back to key for inline highlight
      const map = {
        "Contact name": "contactName", "Contact email": "contactEmail", "Role / title": "contactRole",
        "Company name": "companyName", "Website": "website", "Country": "country",
        "Stage": "stage", "Team size": "teamSize", "Funding raised": "funding",
        "Problem statement": "problem", "Solution": "solution", "EAT framework alignment": "framework",
        "Pitch deck": "deck",
      };
      const k = map[b.field];
      if (k && b.kind === "missing") errs[k] = b.msg;
    }
    setErrors(errs);

    setReviewState({ loading: true, status: "Checking required fields…" });
    setTimeout(() => setReviewState({ loading: true, status: "Reading problem & solution…" }), 700);
    setTimeout(() => setReviewState({ loading: true, status: "Scoring framework alignment…" }), 1500);

    const result = await runReview(form, tweaks.strictness);
    setReviewState({ result });
  };

  const handleConfirmSubmit = () => {
    const ref = "GCS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const time = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    setReviewState(s => ({ submitted: true, ref, score: s.result?.score ?? 0, time }));
  };

  const resetAll = () => {
    setForm(EMPTY_FORM); setCurrent(0); setErrors({}); setReviewState(null);
  };
  const fillDemo = () => {
    setForm(DEMO_FORM); setErrors({});
  };

  const StepComp = STEP_COMPONENTS[STEPS[current].id];
  const isLast = current === STEPS.length - 1;
  const isSingle = tweaks.layout === "single";

  return (
    <React.Fragment>
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark" />
          <span>Global Call for Startups</span>
        </div>
        <div className="brand-partners">
          <span>Katapult</span>
          <span>Norrsken</span>
          <span>EAT Foundation</span>
        </div>
        <button className="topbar-cta" onClick={() => document.querySelector(".apply-divider")?.scrollIntoView({ behavior: "smooth" })}>Apply now →</button>
      </div>
      <div className={"shell" + (isSingle ? " single-wrap" : "")}>

      <Hero theme={tweaks.theme} />
      <Criteria />

      <div className="apply-divider">
        <div className="apply-divider-inner">
          <div>
            <div className="eyebrow">§ 02 — Submit your idea</div>
            <h2>Apply here.<br/><em>Six sections. Fifteen minutes.</em></h2>
          </div>
          <div className="apply-divider-meta">
            Applications are reviewed by the EAT-Lancet jury and partners. <b>Closing 15 June 2026.</b>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 24, maxWidth: 1080, marginLeft: "auto", marginRight: "auto" }}>
        <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 12 }} onClick={fillDemo}>Fill demo data</button>
        <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 12 }} onClick={resetAll}>Reset</button>
      </div>

      {isSingle ? (
        <div>
          {STEPS.map((s, i) => {
            const Comp = STEP_COMPONENTS[s.id];
            return (
              <div className="panel" key={s.id} data-screen-label={`${s.num} ${s.label}`}>
                <div className="panel-head">
                  <div className="panel-num">Section {s.num} — {s.label}</div>
                  <h2>{stepTitle(s.id)}</h2>
                  <p>{stepSub(s.id)}</p>
                </div>
                <Comp form={form} set={set} errors={errors} />
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
            <button className="btn btn-submit" onClick={handleReview}>Review & submit →</button>
          </div>
        </div>
      ) : (
        <div className="form-wrap">
          <Stepper steps={STEPS} current={current} completed={completed} onJump={goto} progress={progress} />
          <div className="panel" data-screen-label={`${STEPS[current].num} ${STEPS[current].label}`}>
            <div className="panel-head">
              <div className="panel-num">Section {STEPS[current].num} — {STEPS[current].label}</div>
              <h2>{stepTitle(STEPS[current].id)}</h2>
              <p>{stepSub(STEPS[current].id)}</p>
            </div>
            <StepComp form={form} set={set} errors={errors} />
            <div className="panel-foot">
              <button className="btn btn-ghost" onClick={() => goto(current - 1)} disabled={current === 0}>← Back</button>
              {isLast
                ? <button className="btn btn-submit" onClick={handleReview}>Review & submit →</button>
                : <button className="btn btn-primary" onClick={() => goto(current + 1)}>Continue →</button>}
            </div>
          </div>
        </div>
      )}

      <ReviewModal
        state={reviewState}
        onClose={() => setReviewState(null)}
        onRevise={() => setReviewState(null)}
        onConfirmSubmit={handleConfirmSubmit}
      />
      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksVisible} />
    </div>
    </React.Fragment>
  );
}

function stepTitle(id) {
  return {
    contact: "Who are we talking to?",
    company: "Tell us about your company",
    stage: "Where are you on the journey?",
    solution: "The problem and your solution",
    framework: "Alignment with the scientific framework",
    deck: "Upload your pitch deck",
  }[id];
}
function stepSub(id) {
  return {
    contact: "One lead contact per application. We'll correspond here throughout the process.",
    company: "The basics. Keep the website URL current — reviewers visit.",
    stage: "Used to set the right peer group for evaluation. Pre-seed to Series A only.",
    solution: "Specificity wins here. Vague answers are the most common reason for a weak review.",
    framework: "Show us you understand EAT Lancet 2.0 and name the guardrails your solution moves.",
    deck: "One file. The deck is your primary artefact for round one.",
  }[id];
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
