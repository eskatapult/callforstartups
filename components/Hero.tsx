import { CONTENT } from "@/lib/content";

export default function Hero() {
  const h = CONTENT.hero;
  return (
    <section className="hero">
      <div className="hero-grid">
        <div>
          <div className="eyebrow">{h.eyebrow}</div>
          <h1>
            {h.headline} {h.headlineAccent}
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
          <div className="hero-actions">
            <a href="#apply" className="btn btn-primary">Apply now →</a>
          </div>
        </div>
        <div className="hero-image">
          <span className="hero-image-label">[ Photo: Norrsken Impact Week — pitch stage ]</span>
        </div>
      </div>
    </section>
  );
}
