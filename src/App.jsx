import { lazy, Suspense, useEffect, useState } from "react";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import { nav } from "./data/portfolio.js";
import { About } from "./components/About.jsx";
import { Activities } from "./components/Activities.jsx";
import { Contact } from "./components/Contact.jsx";
import { Education } from "./components/Education.jsx";
import { Experience } from "./components/Experience.jsx";
import { Footer } from "./components/Footer.jsx";
import { Hero } from "./components/Hero.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Projects } from "./components/Projects.jsx";
import { Skills } from "./components/Skills.jsx";
import { AdminPage } from "./components/AdminPage.jsx";
import { SignInHost } from "./components/AuthControls.jsx";
import { CircuitBackground } from "./components/CircuitBackground.jsx";

const AdminDevPreview = import.meta.env.DEV
  ? lazy(() => import("./dev/AdminDevPreview.jsx").then((mod) => ({ default: mod.default })))
  : null;

function normalizePath(pathname) {
  return pathname.replace(/\/+$/, "") || "/";
}

function NotFound() {
  return (
    <main id="main" className="relative z-10 grid min-h-screen place-items-center px-4">
      <div className="max-w-lg text-center">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-muted">That address is not part of this site.</p>
        <a
          href="/"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-cyan px-5 font-medium text-ink hover:bg-white"
        >
          Back to the portfolio
        </a>
      </div>
    </main>
  );
}

function AdminRobots() {
  useEffect(() => {
    const tag = document.createElement("meta");
    tag.setAttribute("name", "robots");
    tag.setAttribute("content", "noindex, nofollow");
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);
  return null;
}

function AdminEntry() {
  if (AdminDevPreview) {
    const preview = new URLSearchParams(window.location.search).get("preview");
    if (preview === "visitors" || preview === "unauthorised") {
      return (
        <Suspense fallback={<p className="relative z-10 px-4 py-16 text-muted">Loading preview…</p>}>
          <AdminDevPreview kind={preview} />
        </Suspense>
      );
    }
  }
  return <AdminPage />;
}

function Portfolio() {
  const [active, setActive] = useState(nav[0].id);

  useEffect(() => {
    const markerOffset = 120;

    function sectionTop(id) {
      const el = document.getElementById(id);
      if (!el) return null;
      return el.getBoundingClientRect().top + window.scrollY;
    }

    function updateActive() {
      const marker = window.scrollY + markerOffset;
      let current = nav[0].id;
      for (const item of nav) {
        const top = sectionTop(item.id);
        if (top != null && top <= marker) current = item.id;
      }
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
        current = nav[nav.length - 1].id;
      }
      setActive(current);
    }

    function scrollToHash() {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "auto", block: "start" });
    }

    scrollToHash();
    updateActive();
    const frame = window.requestAnimationFrame(() => {
      scrollToHash();
      updateActive();
    });
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cyan focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <div className="relative z-10">
        <Navbar active={active} onNavigate={setActive} />
        <main id="main">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Education />
          <Experience />
          <Activities />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  const [path] = useState(() => normalizePath(window.location.pathname));

  let page = <NotFound />;
  if (path === "/" || path === "/index.html") page = <Portfolio />;
  if (path === "/admin" || path === "/admin/index.html") {
    page = (
      <>
        <AdminRobots />
        <AdminEntry />
      </>
    );
  }

  return (
    <AuthProvider>
      <CircuitBackground />
      {page}
      <SignInHost />
    </AuthProvider>
  );
}
