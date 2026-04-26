import { CONTENT } from "@/lib/content";

export default function Topbar() {
  const { brand } = CONTENT;
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark" />
        <span>{brand.name}</span>
      </div>
      <div className="brand-partners">
        {brand.partners.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </div>
      <a href="#apply" className="topbar-cta">
        {brand.cta}
      </a>
    </header>
  );
}
