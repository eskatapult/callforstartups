// Form field primitives + criteria data
const { useState, useEffect, useRef, useMemo } = React;

const CRITERIA = [
  { num: "01", title: "Impact", body: "At scale the innovation will make a significant contribution in alignment with the EAT Lancet 2.0 vision." },
  { num: "02", title: "Innovation", body: "Innovation is based on a scalable technology with clear freedom to operate." },
  { num: "03", title: "Technology", body: "Validated technology in laboratory or relevant environment." },
  { num: "04", title: "Business Stage", body: "Seed to Series A — open for pre-seed with some traction." },
  { num: "05", title: "Customer", body: "Benefits confirmed from primary market research or first customer testing." },
  { num: "06", title: "Team", body: "Founder(s) with proven relevant experience and full-time commitment." },
  { num: "07", title: "Benefit from support", body: "Support from Anchor Partners will bring a catalytic effect to winners." },
];

const STAGES = ["Pre-seed", "Seed", "Series A", "Series A+"];
const TEAM_SIZES = ["1-2", "3-5", "6-10", "11-25", "26-50", "50+"];
const COUNTRIES = ["Select country…", "Sweden", "Norway", "Denmark", "Finland", "Iceland", "Netherlands", "Germany", "France", "United Kingdom", "Ireland", "Spain", "Portugal", "Italy", "Switzerland", "United States", "Canada", "Brazil", "Kenya", "Nigeria", "South Africa", "India", "Singapore", "Japan", "Australia", "Other"];
const FUNDING_BANDS = ["None yet", "Under $250k", "$250k–$1M", "$1M–$5M", "$5M–$15M", "$15M+"];

const STEPS = [
  { id: "contact",  num: "01", label: "Contact",       hint: "Who we're talking to" },
  { id: "company",  num: "02", label: "Company",       hint: "About the venture" },
  { id: "stage",    num: "03", label: "Stage & Team",  hint: "Where you are" },
  { id: "solution", num: "04", label: "Problem & Solution", hint: "What you're building" },
  { id: "framework",num: "05", label: "EAT Alignment", hint: "Scientific fit" },
  { id: "deck",     num: "06", label: "Pitch Deck",    hint: "Upload materials" },
];

function Field({ label, optional, counter, children, help, error }) {
  return (
    <div className="field">
      <label>
        <span>{label}</span>
        <span>
          {counter && <span className={"counter " + (counter.over ? "over" : "")}>{counter.text}</span>}
          {optional && <span className="optional">Optional</span>}
        </span>
      </label>
      {children}
      {help && !error && <div className="field-help">{help}</div>}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

function TextField({ value, onChange, placeholder, type = "text", error, ...rest }) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={error ? "error" : ""}
      {...rest}
    />
  );
}

function Select({ value, onChange, options, error }) {
  return (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)} className={error ? "error" : ""}>
      {options.map((opt, i) => (
        <option key={i} value={i === 0 && opt.startsWith("Select") ? "" : opt}>{opt}</option>
      ))}
    </select>
  );
}

function TextArea({ value, onChange, placeholder, rows = 5, error }) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={error ? "error" : ""}
    />
  );
}

function FileUpload({ file, onChange, accept = ".pdf,.ppt,.pptx,.key", error }) {
  const inputRef = useRef(null);
  const handle = (f) => {
    if (!f) return;
    onChange({ name: f.name, size: f.size, type: f.type });
  };
  const fmtSize = (b) => {
    if (b < 1024) return b + " B";
    if (b < 1024*1024) return (b/1024).toFixed(0) + " KB";
    return (b/1024/1024).toFixed(1) + " MB";
  };
  if (file) {
    return (
      <div className="file-attached">
        <div className="file-icon">{(file.name.split(".").pop() || "FILE").toUpperCase().slice(0,4)}</div>
        <div className="file-meta">
          <div className="file-name">{file.name}</div>
          <div className="file-size">{fmtSize(file.size)} · uploaded</div>
        </div>
        <button className="file-remove" onClick={() => onChange(null)}>Remove</button>
      </div>
    );
  }
  return (
    <div className={"file-drop" + (error ? " error" : "")} onClick={() => inputRef.current?.click()}>
      <div className="file-drop-icon">↑</div>
      <div className="file-drop-title">Upload pitch deck</div>
      <div className="file-drop-hint">PDF, PPTX or KEY · up to 25 MB · max 20 slides recommended</div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => handle(e.target.files[0])}
      />
    </div>
  );
}

function Hero({ theme, onApplyClick }) {
  return (
    <section className="hero">
      <div className="eyebrow">Global Call for Startups · 2026 · Applications open</div>
      <h1>
        Apply here. Help us transform the food system at the scale <span className="accent">science demands</span>.
      </h1>
      <p className="hero-lede">
        A competition for early-stage ventures, built on the 2025 EAT-Lancet Commission report — the global
        guardrails for healthy, sustainable, and socially just food systems. Winners pitch at Impact/Week
        Barcelona and gain tailored support from Katapult and Norrsken.
      </p>
      <div className="hero-meta">
        <div className="hero-meta-item">
          <div className="hero-meta-label">Stage</div>
          <div className="hero-meta-val">Pre-seed → Series A</div>
        </div>
        <div className="hero-meta-item">
          <div className="hero-meta-label">Closing</div>
          <div className="hero-meta-val">15 June 2026</div>
        </div>
        <div className="hero-meta-item">
          <div className="hero-meta-label">Framework</div>
          <div className="hero-meta-val">EAT-Lancet 2.0</div>
        </div>
        <div className="hero-meta-item">
          <div className="hero-meta-label">Time to apply</div>
          <div className="hero-meta-val">~15 minutes</div>
        </div>
      </div>
    </section>
  );
}

function Criteria() {
  return (
    <section className="criteria">
      <div className="section-head">
        <span className="num">§ 01 — Selection criteria</span>
        <h2>What we look for</h2>
        <div className="aside">Seven criteria applied across every round of evaluation — the EAT-Lancet 2.0 scientific framework with a commercial lens.</div>
      </div>
      <div className="criteria-grid">
        {CRITERIA.map(c => (
          <div className="crit" key={c.num}>
            <div className="crit-num">{c.num}</div>
            <h4 className="crit-title">{c.title}</h4>
            <p className="crit-body">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stepper({ steps, current, completed, onJump, progress }) {
  return (
    <aside className="stepper">
      <div className="stepper-title">Your application</div>
      {steps.map((s, i) => (
        <div
          key={s.id}
          className={"step" + (i === current ? " active" : "") + (completed[s.id] ? " done" : "")}
          onClick={() => onJump(i)}
        >
          <span className="step-num">{s.num}</span>
          <div className="step-body">
            <div className="step-label">{s.label}</div>
            <div className="step-hint">{s.hint}</div>
          </div>
          <span className="step-check" />
        </div>
      ))}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-text">{Math.round(progress)}% ready to review</div>
    </aside>
  );
}

Object.assign(window, {
  CRITERIA, STAGES, TEAM_SIZES, COUNTRIES, FUNDING_BANDS, STEPS,
  Field, TextField, Select, TextArea, FileUpload,
  Hero, Criteria, Stepper,
});
