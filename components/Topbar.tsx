import { CONTENT } from "@/lib/content";

const NAV_LINKS = ["Apply", "About", "Winners 2025", "Partners", "FAQ", "Contact"];

export default function Topbar() {
  const { brand } = CONTENT;
  return (
    <header className="topbar">
      <div className="brand">
        <span>{brand.name}</span>
      </div>
      <nav className="brand-partners">
        {NAV_LINKS.map((link) => (
          <span key={link}>{link}</span>
        ))}
      </nav>
      <a href="#apply" className="topbar-cta">
        {brand.cta}
      </a>
    </header>
  );
}
