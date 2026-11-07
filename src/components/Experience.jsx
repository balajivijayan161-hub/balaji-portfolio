import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { certifications, experience, experienceSection } from "../data/portfolio.js";
import { SectionHeading } from "./SectionHeading.jsx";

function CertificateCard({ item }) {
  const [failed, setFailed] = useState(!item.image);
  const showImage = Boolean(item.image) && !failed;

  const card = showImage ? (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel/80 transition group-hover:border-cyan/40">
      <img
        src={item.image}
        alt={item.imageAlt || `${item.issuer} ${item.name} certificate`}
        className="aspect-[4/3] w-full bg-ink object-contain"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan">{item.issuer}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug text-white">{item.name}</h3>
        {item.date ? <p className="mt-2 font-mono text-xs text-muted">{item.date}</p> : null}
        {item.description ? <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p> : null}
        {item.href ? <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-cyan">View certificate</p> : null}
      </div>
    </article>
  ) : (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-panel/80 p-5 transition group-hover:border-cyan/40">
      <BadgeCheck aria-hidden="true" className="h-7 w-7 text-cyan" />
      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan">{item.issuer}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug text-white">{item.name}</h3>
        {item.date ? <p className="mt-2 font-mono text-xs text-muted">{item.date}</p> : null}
        {item.description ? <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p> : null}
      </div>
    </article>
  );

  if (!item.href) return card;

  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className="group block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan">
      {card}
    </a>
  );
}

export function Experience() {
  return (
    <section id={experienceSection.id} className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index={experienceSection.index}
          eyebrow={experienceSection.eyebrow}
          title={experienceSection.title}
        />
        <h3 className="mt-10 text-sm font-medium uppercase tracking-[0.18em] text-muted">{experienceSection.experienceLabel}</h3>
        <ol className="relative mt-5 max-w-3xl space-y-6 border-l border-cyan/30 pl-6">
          {experience.map((item) => (
            <li key={item.id} className="relative">
              <span className="absolute -left-[1.65rem] top-1.5 h-3 w-3 rounded-full border-2 border-cyan bg-ink" aria-hidden="true" />
              <article className="rounded-2xl border border-white/10 bg-panel/80 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan">{item.time}</p>
                <h4 className="mt-2 text-xl font-semibold text-white">{item.role}</h4>
                <p className="mt-1 text-mist">
                  {item.org} · {item.place}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>

        <h3 className="mt-12 text-sm font-medium uppercase tracking-[0.18em] text-muted">{experienceSection.certificationsLabel}</h3>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((item) => (
            <li key={item.id} className="h-full">
              <CertificateCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
