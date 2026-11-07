import { education, educationSection } from "../data/portfolio.js";
import { SectionHeading } from "./SectionHeading.jsx";

export function Education() {
  return (
    <section id={educationSection.id} className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index={educationSection.index} eyebrow={educationSection.eyebrow} title={educationSection.title} />
        <ol className="relative mt-10 max-w-3xl space-y-6 border-l border-cyan/30 pl-6">
          {education.map((item) => (
            <li key={item.id} className="relative">
              <span className="absolute -left-[1.65rem] top-1.5 h-3 w-3 rounded-full border-2 border-cyan bg-ink" aria-hidden="true" />
              <article className="rounded-2xl border border-white/10 bg-panel/80 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan">{item.time}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.credential}</h3>
                <p className="mt-1 text-mist">
                  {item.school}, {item.place}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {item.score} · {item.mode}
                </p>
                {item.description ? <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p> : null}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
