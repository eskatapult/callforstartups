import { CONTENT } from "@/lib/content";

export default function Hero() {
  const h = CONTENT.hero;
  return (
    <section className="hero">
      <div className="eyebrow">{h.eyebrow}</div>
      <h1>
        {h.headline} <span className="accent">{h.headlineAccent}</span>
        {h.headlineEnd}
      </h1>
      <p className="hero-lede">{h.lede}</p>
      <div className="hero-meta">
        {h.meta.map((item) => (
          <div className="hero-meta-item" key={item.label}>
            <div className="hero-meta-label">{item.label}</div>
            <div className="hero-meta-val">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
