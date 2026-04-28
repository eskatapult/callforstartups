import { CONTENT } from "@/lib/content";

const NAV_LINKS = [
  { label: "Apply",        href: "#apply" },
  { label: "About",        href: "https://globalcall.tech/about" },
  { label: "Winners 2025", href: "https://globalcall.tech/winners" },
  { label: "Partners",     href: "https://globalcall.tech/partners" },
  { label: "FAQ",          href: "https://globalcall.tech/faq" },
  { label: "Contact",      href: "https://globalcall.tech/contact" },
];

export default function Topbar() {
  const { brand } = CONTENT;
  return (
    <header className="topbar">
      <div className="brand">
        <span>{brand.name}</span>
      </div>
      <nav className="brand-partners">
        {NAV_LINKS.map(({ label, href }) => (
          <a key={label} href={href}>{label}</a>
        ))}
      </nav>
      <a href="#apply" className="topbar-cta">
        {brand.cta}
      </a>
    </header>
  );
}
