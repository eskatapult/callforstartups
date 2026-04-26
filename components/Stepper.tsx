"use client";

import { CONTENT } from "@/lib/content";

interface StepperProps {
  current: number;
  completed: Record<string, boolean>;
  progress: number;
  onJump: (i: number) => void;
}

export default function Stepper({ current, completed, progress, onJump }: StepperProps) {
  const { stepperTitle, progressSuffix } = CONTENT.form;
  const steps = CONTENT.steps;

  return (
    <aside className="stepper">
      <div className="stepper-title">{stepperTitle}</div>
      {steps.map((s, i) => (
        <div
          key={s.id}
          className={
            "step" + (i === current ? " active" : "") + (completed[s.id] ? " done" : "")
          }
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
      <div className="progress-text">
        {Math.round(progress)}
        {progressSuffix}
      </div>
    </aside>
  );
}
