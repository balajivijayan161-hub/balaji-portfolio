import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { profile, site } from "../data/portfolio.js";
import { visibleLinks } from "../lib/project-links.js";
import { Footer } from "./Footer.jsx";
import { Navbar } from "./Navbar.jsx";

export function ProjectPage({ project }) {
  const [index, setIndex] = useState(0);
  const image = project.gallery[index];
  const links = visibleLinks(project);
  const multiple = project.gallery.length > 1;

  useEffect(() => {
    const previous = document.title;
    document.title = `${project.title} — ${profile.name}`;
    return () => {
      document.title = previous || site.title;
    };
  }, [project]);

  useEffect(() => {
    if (!multiple) return undefined;

    function onKey(event) {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.key === "ArrowRight") {
        setIndex((value) => (value + 1) % project.gallery.length);
      }
      if (event.key === "ArrowLeft") {
        setIndex((value) => (value - 1 + project.gallery.length) % project.gallery.length);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [multiple, project.gallery.length]);

  function step(delta) {
    setIndex((value) => (value + delta + project.gallery.length) % project.gallery.length);
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cyan focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <div className="relative z-10">
        <Navbar />
        <main id="main" className="px-4 py-10 sm:px-6 sm:py-14">
          <article className="mx-auto max-w-5xl">
            <a href="/#projects" className="font-mono text-xs uppercase tracking-[0.18em] text-cyan hover:text-white">
              Back to projects
            </a>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white text-balance sm:text-5xl">{project.title}</h1>
            <p className="mt-4 text-cyan">{project.credit}</p>
            {project.context ? <p className="mt-1 text-sm text-muted">{project.context}</p> : null}
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-mist">{project.summary}</p>

            <figure className="mt-8">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink">
                <img
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="max-h-[72vh] w-full object-contain"
                />
                {multiple ? (
                  <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-ink/80 text-white hover:border-cyan hover:text-cyan"
                      aria-label="Previous image"
                    >
                      <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-ink/80 text-white hover:border-cyan hover:text-cyan"
                      aria-label="Next image"
                    >
                      <ChevronRight aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>
                ) : null}
              </div>
              <figcaption className="mt-3 text-sm leading-relaxed text-muted">{image.caption}</figcaption>
            </figure>

            {multiple ? (
              <ul className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {project.gallery.map((shot, shotIndex) => (
                  <li key={shot.src} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setIndex(shotIndex)}
                      aria-label={`Show image ${shotIndex + 1}: ${shot.caption}`}
                      aria-current={shotIndex === index ? "true" : undefined}
                      className={`block h-16 w-24 overflow-hidden rounded-md border ${
                        shotIndex === index ? "border-cyan" : "border-white/10"
                      }`}
                    >
                      <img src={shot.src} alt="" width={shot.width} height={shot.height} className="h-full w-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-mist">
              {project.details.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((tag) => (
                <li key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-blue">
                  {tag}
                </li>
              ))}
            </ul>
            {links.length > 0 ? (
              <ul className="mt-6 space-y-3">
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
              <p className="mt-6 text-sm text-muted">No public repository or demo link is available for this project.</p>
            )}
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
}
