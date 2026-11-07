import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { projects, projectsSection } from "../data/portfolio.js";
import { projectPath, visibleLinks } from "../lib/project-links.js";
import { SectionHeading } from "./SectionHeading.jsx";

function TiltCard({ children }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  function onMove(event) {
    const el = ref.current;
    if (!el || reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg)`;
  }

  function reset() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className="h-full transition-transform duration-150 [transform-style:preserve-3d]">
      {children}
    </div>
  );
}

export function Projects() {
  return (
    <section id={projectsSection.id} className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index={projectsSection.index} eyebrow={projectsSection.eyebrow} title={projectsSection.title}>
          {projectsSection.intro}
        </SectionHeading>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {projects.map((project) => {
            const cover = project.gallery[0];
            const links = visibleLinks(project);
            const href = projectPath(project.id);
            return (
              <TiltCard key={project.id}>
                <article className="pcb-frame flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel/85">
                  <a
                    href={href}
                    aria-label={`View details for ${project.title}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-ink"
                  >
                    <img
                      src={cover.src}
                      alt={cover.alt}
                      width={cover.width}
                      height={cover.height}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-cover${project.id === "atm-cash-monitoring" ? " object-top" : ""}`}
                    />
                    {project.coverBadge ? (
                      <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-cyan">
                        {project.coverBadge}
                      </span>
                    ) : null}
                  </a>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold text-white">
                      <a href={href} className="hover:text-cyan">
                        {project.title}
                      </a>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>
                    <p className="mt-3 text-sm text-cyan">{project.credit}</p>
                    {project.context ? <p className="mt-1 text-xs text-muted">{project.context}</p> : null}
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 6).map((tag) => (
                        <li key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-blue">
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <a href={href} className="mt-4 self-start text-sm font-medium text-white underline-offset-4 hover:underline">
                      View details
                    </a>
                  </div>
                  {links.length > 0 ? (
                    <div className="mt-auto flex flex-wrap gap-4 px-5 pb-5">
                      {links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-cyan underline-offset-4 hover:underline"
                        >
                          {link.label}
                          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </article>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
