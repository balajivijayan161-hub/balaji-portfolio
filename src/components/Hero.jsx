import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { profile, socials } from "../data/portfolio.js";
import { ProfileAvatar } from "./ProfileAvatar.jsx";
import { SocialLink } from "./SocialIcons.jsx";

function TypingTitle({ text }) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced || count >= text.length) return undefined;
    const timer = window.setTimeout(() => setCount((value) => value + 1), 78);
    return () => window.clearTimeout(timer);
  }, [count, reduced, text]);

  const shown = reduced ? text.length : count;
  const done = shown >= text.length;

  return (
    <p className="mt-3 font-mono text-xl text-cyan sm:text-2xl">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        {done ? null : <span className="caret">|</span>}
      </span>
    </p>
  );
}

export function Hero() {
  return (
    <section id="home" className="scroll-mt-24 px-4 pb-16 pt-12 sm:px-6 sm:pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="order-2 lg:order-1">
          {profile.openToWork ? (
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden="true" />
              {profile.openToWorkText}
            </p>
          ) : null}
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.22em] text-blue">{profile.kicker}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-6xl">{profile.name}</h1>
          <TypingTitle text={profile.title} />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-mist sm:text-lg">{profile.objective}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={profile.resume.href}
              download={profile.resume.download}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-cyan px-5 font-medium text-ink transition-colors hover:bg-white"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              {profile.resume.label}
            </a>
            <a
              href="#projects"
              className="inline-flex h-12 items-center justify-center rounded-full border border-cyan/50 px-5 font-medium text-cyan transition-colors hover:bg-cyan/10"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-line px-5 font-medium text-mist transition-colors hover:border-white/40"
            >
              Contact
            </a>
          </div>
          <ul className="mt-8 flex items-center gap-3">
            {socials.map((item) => (
              <li key={item.id}>
                <SocialLink {...item} />
              </li>
            ))}
          </ul>
        </div>
        <div className="order-1 justify-self-center lg:order-2">
          <ProfileAvatar photo={profile.photo} />
        </div>
      </div>
    </section>
  );
}
