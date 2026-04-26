// Tweaks panel — color theme, layout, strictness
function TweaksPanel({ tweaks, setTweaks, visible }) {
  if (!visible) return null;
  const set = (k, v) => setTweaks({ ...tweaks, [k]: v });
  return (
    <div className="tweaks">
      <div className="tweaks-title">
        <span>Tweaks</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)" }}>v1</span>
      </div>
      <div className="tweak-group">
        <div className="tweak-label">Color theme</div>
        <div className="tweak-opts">
          {["neutral", "katapult", "norrsken"].map(t => (
            <button key={t} className={"tweak-opt" + (tweaks.theme === t ? " active" : "")} onClick={() => set("theme", t)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="tweak-group">
        <div className="tweak-label">Layout</div>
        <div className="tweak-opts">
          {["stepped", "single"].map(t => (
            <button key={t} className={"tweak-opt" + (tweaks.layout === t ? " active" : "")} onClick={() => set("layout", t)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="tweak-group">
        <div className="tweak-label">Validation strictness</div>
        <div className="tweak-opts">
          {["lenient", "standard", "strict"].map(t => (
            <button key={t} className={"tweak-opt" + (tweaks.strictness === t ? " active" : "")} onClick={() => set("strictness", t)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="tweak-group">
        <div className="tweak-label">Visual variant</div>
        <div className="tweak-opts">
          {["panel", "editorial"].map(t => (
            <button key={t} className={"tweak-opt" + (tweaks.variant === t ? " active" : "")} onClick={() => set("variant", t)}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TweaksPanel });
