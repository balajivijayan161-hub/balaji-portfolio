import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAuth } from "../auth/auth-context.js";
import { isSupabaseConfigured } from "../lib/supabase.js";
import { nav, profile } from "../data/portfolio.js";
import { AuthControls } from "./AuthControls.jsx";

export function Navbar({ active, onNavigate }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const { isAdmin } = useAuth();
  const showAuth =
    isSupabaseConfigured() ||
    (import.meta.env.DEV && new URLSearchParams(window.location.search).get("preview") === "signin");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function go(id) {
    setOpen(false);
    onNavigate?.(id);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="/#home" className="font-mono text-sm tracking-[0.18em] text-cyan" onClick={() => go("home")}>
          {profile.photo.initials}
        </a>
        <nav className="hidden lg:block" aria-label="Primary">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`/#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  onClick={() => go(item.id)}
                  className={`rounded-full px-2.5 py-1.5 text-sm transition-colors ${
                    active === item.id ? "bg-cyan/10 text-cyan" : "text-muted hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            {isAdmin ? (
              <li>
                <a href="/admin" className="rounded-full px-2.5 py-1.5 text-sm text-cyan hover:text-white">
                  Visitors
                </a>
              </li>
            ) : null}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <AuthControls />
          </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-mist lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-ink lg:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`/#${item.id}`}
                    aria-current={active === item.id ? "true" : undefined}
                    onClick={() => go(item.id)}
                    className={`block rounded-lg px-3 py-3 text-base ${
                      active === item.id ? "bg-cyan/10 text-cyan" : "text-mist"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              {isAdmin ? (
                <li>
                  <a href="/admin" className="block rounded-lg px-3 py-3 text-base text-cyan" onClick={() => setOpen(false)}>
                    Visitors
                  </a>
                </li>
              ) : null}
              {showAuth ? (
                <li className="px-3 pt-2">
                  <AuthControls variant="menu" onNavigate={() => setOpen(false)} />
                </li>
              ) : null}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
