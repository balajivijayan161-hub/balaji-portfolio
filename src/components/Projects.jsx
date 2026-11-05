import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "framer-motion";
import { projects, projectsSection } from "../data/portfolio.js";
import { SectionHeading } from "./SectionHeading.jsx";

function visibleLinks(project) {
  const links = [...(project.links || [])];
  const github = String(project.github || "").trim();
  if (github && !links.some((link) => link.href === github)) {
    links.push({ label: "GitHub", href: github });
  }
  return links;
}

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

function focusableIn(root) {
  return [...root.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])")].filter(
    (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1 && el.getClientRects().length > 0,
  );
}

function ProjectDialog({ project, onClose, returnFocusTo }) {
  const ref = useRef(null);
  const closeRef = useRef(null);
  const titleId = useId();
  const galleryLength = useRef(project.gallery.length);
  const [index, setIndex] = useState(0);
  const image = project.gallery[index];
  const links = visibleLinks(project);

  useEffect(() => {
    galleryLength.current = project.gallery.length;
  }, [project.gallery.length]);

  useEffect(() => {
    const dialog = ref.current;
    const opener = returnFocusTo;
    if (!dialog) return undefined;
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();

    function onKey(event) {
      if (event.key === "ArrowRight") {
        setIndex((value) => (value + 1) % galleryLength.current);
      }
      if (event.key === "ArrowLeft") {
        setIndex((value) => (value - 1 + galleryLength.current) % galleryLength.current);
      }
      if (event.key !== "Tab") return;
      const items = focusableIn(dialog);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = dialog.contains(active);
      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    }

    dialog.addEventListener("keydown", onKey);
    return () => {
      dialog.removeEventListener("keydown", onKey);
      if (dialog.open) dialog.close();
      if (opener instanceof HTMLElement && document.contains(opener)) opener.focus();
    };
  }, [returnFocusTo]);

  function step(delta) {
    setIndex((value) => (value + delta + project.gallery.length) % project.gallery.length);
  }

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-mist"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div
        data-backdrop="true"
        className="flex min-h-full items-start justify-center p-3 sm:items-center sm:p-6"
        onClick={(event) => {
          if (event.target instanceof HTMLElement && event.target.dataset.backdrop === "true") onClose();
        }}
      >
        <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-cyan/30 bg-navy p-4 shadow-2xl sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-2xl font-semibold text-white text-balance">
              {project.title}
            </h2>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-mist hover:border-cyan hover:text-cyan"
            >
              <X aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">Close project details</span>
            </button>
          </div>
          <p className="mt-3 rounded-xl border border-cyan/20 bg-cyan/5 px-3 py-2 text-sm text-mist">{project.credit}</p>
          {project.context ? <p className="mt-2 text-sm text-muted">{project.context}</p> : null}

          <figure className="mt-5">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ink">
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="max-h-[46vh] w-full object-contain"
              />
              {project.gallery.length > 1 ? (
                <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink/80 text-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink/80 text-white"
                    aria-label="Next image"
                  >
                    <ChevronRight aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>
              ) : null}
            </div>
            <figcaption className="mt-2 text-sm leading-relaxed text-muted">{image.caption}</figcaption>
          </figure>

          {project.gallery.length > 1 ? (
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {project.gallery.map((shot, shotIndex) => (
                <li key={shot.src} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setIndex(shotIndex)}
                    aria-label={`Show image ${shotIndex + 1}: ${shot.caption}`}
                    aria-current={shotIndex === index ? "true" : undefined}
                    className={`block h-16 w-20 overflow-hidden rounded-md border ${
                      shotIndex === index ? "border-cyan" : "border-white/10"
                    }`}
                  >
                    <img src={shot.src} alt="" width={shot.width} height={shot.height} className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-5 space-y-3 text-sm leading-relaxed text-mist sm:text-base">
            {project.details.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((tag) => (
              <li key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-blue">
                {tag}
              </li>
            ))}
          </ul>
          {links.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-cyan underline-offset-4 hover:underline"
                  >
                    {link.label}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                  {link.note ? <p className="mt-1 text-sm text-muted">{link.note}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm text-muted">No public repository or demo link is listed for this project.</p>
          )}
        </div>
      </div>
    </dialog>,
    document.body,
  );
}

export function Projects() {
  const [open, setOpen] = useState(null);
  const openProject = projects.find((project) => project.id === open?.id) ?? null;

  function openFrom(event, id) {
    setOpen({ id, opener: event.currentTarget });
  }

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
            return (
              <TiltCard key={project.id}>
                <article className="pcb-frame flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel/85">
                  <button
                    type="button"
                    onClick={(event) => openFrom(event, project.id)}
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
                      className="h-full w-full object-cover"
                    />
                    {project.coverBadge ? (
                      <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-cyan">
                        {project.coverBadge}
                      </span>
                    ) : null}
                  </button>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold text-white">
                      <button type="button" onClick={(event) => openFrom(event, project.id)} className="text-left hover:text-cyan">
                        {project.title}
                      </button>
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
                    <button
                      type="button"
                      onClick={(event) => openFrom(event, project.id)}
                      className="mt-4 self-start text-sm font-medium text-white underline-offset-4 hover:underline"
                    >
                      View details
                    </button>
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
      {openProject ? (
        <ProjectDialog project={openProject} returnFocusTo={open.opener} onClose={() => setOpen(null)} />
      ) : null}
    </section>
  );
}
