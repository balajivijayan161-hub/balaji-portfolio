import { about } from "../data/portfolio.js";
import { SectionHeading } from "./SectionHeading.jsx";

export function About() {
  return (
    <section id={about.id} className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index={about.index} eyebrow={about.eyebrow} title={about.title} />
        <div className="mt-8 max-w-3xl space-y-4 border-l-2 border-cyan/60 pl-5 text-lg leading-relaxed text-mist">
          {(Array.isArray(about.text) ? about.text : [about.text]).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {Array.isArray(about.languages) && about.languages.length > 0 ? (
          <div className="mt-8 max-w-3xl">
            <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted">Languages</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {about.languages.map((language) => (
                <li key={language} className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-mist">
                  {language}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
