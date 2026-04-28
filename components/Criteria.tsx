import { CONTENT } from "@/lib/content";

export default function Criteria() {
  const c = CONTENT.criteria;
  return (
    <section className="criteria">
      <div className="section-head">
        <span className="num">{c.sectionNum}</span>
        <h2>{c.heading}</h2>
        <div className="aside">{c.aside}</div>
      </div>
      <div className="criteria-grid">
        {c.items.map((item) => (
          <div className="crit" key={item.num}>
            <div className="crit-num">{item.num}</div>
            <div>
              <h4 className="crit-title">{item.title}</h4>
              <p className="crit-body">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
