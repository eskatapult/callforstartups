"use client";

import { CONTENT } from "@/lib/content";
import type { ReviewState } from "@/lib/types";

interface ReviewModalProps {
  state: ReviewState | null;
  onClose: () => void;
  onRevise: () => void;
  onConfirmSubmit: () => void;
  onDone: () => void;
}

export default function ReviewModal({
  state,
  onClose,
  onRevise,
  onConfirmSubmit,
  onDone,
}: ReviewModalProps) {
  if (!state) return null;
  const c = CONTENT.review;
  const cs = CONTENT.submitted;

  if ("loading" in state) {
    return (
      <div className="overlay" onClick={onClose}>
        <div className="review-card" onClick={(e) => e.stopPropagation()}>
          <div className="review-analyzing">
            <div className="pulse" />
            <h3>{c.loadingTitle}</h3>
            <p>{c.loadingBody}</p>
            <div className="status">{state.status}</div>
          </div>
        </div>
      </div>
    );
  }

  if ("submitted" in state) {
    return (
      <div className="overlay">
        <div className="review-card">
          <div className="submitted-close-row">
            <button className="overlay-close" onClick={onDone} aria-label="Close">✕</button>
          </div>
          <div className="submitted">
            <div className="submitted-mark">✓</div>
            <h3>{cs.title}</h3>
            <p>{cs.body}</p>
            <div className="submitted-meta">
              <span>
                {cs.refLabel} <b>{state.ref}</b>
              </span>
              <span>
                {cs.scoreLabel} <b>{state.score}/100</b>
              </span>
              <span>
                {cs.submittedLabel} <b>{state.time}</b>
              </span>
            </div>
            <button className="btn btn-ghost" style={{ marginTop: 28 }} onClick={onDone}>
              {cs.doneButton}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { result } = state;
  const verdictKind = result.passed
    ? "pass"
    : result.score >= result.threshold - 15
    ? "warn"
    : "fail";
  const verdictLabel = result.passed ? c.verdictPass : verdictKind === "warn" ? c.verdictWarn : c.verdictFail;
  const headline = result.passed ? c.headlinePass : c.headlineWarn;

  return (
    <div className="overlay" onClick={onRevise}>
      <div className="review-card" onClick={(e) => e.stopPropagation()}>
        <div className="review-head">
          <div className="review-eyebrow">{c.eyebrow}</div>
          <div className="review-verdict">
            <div className="verdict-score">
              {result.score}
              <small>/100</small>
            </div>
            <div className="verdict-text">
              <span className={`verdict-pill ${verdictKind}`}>{verdictLabel}</span>
              <h3>{headline}</h3>
              <p>
                {c.thresholdLabel} {result.threshold}/100.
              </p>
            </div>
          </div>
        </div>
        <div className="review-body">
          <div className="review-summary">{result.summary}</div>
          {result.flags.map((flag, i) => (
            <div className="flag" key={i} data-kind={flag.kind}>
              <div className="flag-icon">
                {flag.kind === "ok" ? "✓" : flag.kind === "missing" ? "✕" : "!"}
              </div>
              <div>
                <div className="flag-field">{flag.field}</div>
                <div className="flag-msg">{flag.msg}</div>
                {flag.suggestion && (
                  <div className="flag-suggestion">Suggested: {flag.suggestion}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="review-foot">
          <button className="btn btn-ghost" onClick={onRevise}>
            {c.backToEdit}
          </button>
          {result.passed ? (
            <button className="btn btn-primary" onClick={onConfirmSubmit}>
              {c.submitButton}
            </button>
          ) : (
            <button className="btn btn-ghost" onClick={onConfirmSubmit} title="Submit anyway">
              {c.submitAnywayButton}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
