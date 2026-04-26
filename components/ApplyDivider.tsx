import { CONTENT } from "@/lib/content";

export default function ApplyDivider() {
  const d = CONTENT.applyDivider;
  return (
    <div id="apply" className="apply-divider">
      <div className="apply-divider-inner">
        <div>
          <div className="eyebrow">{d.eyebrow}</div>
          <h2>
            {d.headline}
            <br />
            <em>{d.headlineItalic}</em>
          </h2>
        </div>
        <div className="apply-divider-meta">
          {d.meta} <b>{d.metaDeadline}</b>
        </div>
      </div>
    </div>
  );
}
