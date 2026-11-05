import { motion, useReducedMotion } from "framer-motion";
import { skills } from "../data/portfolio.js";
import { LeetCodeStats } from "./LeetCodeStats.jsx";
import { SectionHeading } from "./SectionHeading.jsx";

export function Skills() {
  const reduced = useReducedMotion();

  return (
    <section id={skills.id} className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index={skills.index} eyebrow={skills.eyebrow} title={skills.title}>
          {skills.intro}
        </SectionHeading>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {skills.groups.map((group) => (
            <article key={group.id} className="pcb-frame flex h-full flex-col rounded-2xl border border-white/10 bg-panel/80 p-5">
              <h3 className="text-lg font-semibold text-white">{group.label}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item, index) => (
                  <motion.li
                    key={item}
                    className="rounded-full border border-cyan/25 bg-cyan/5 px-3 py-1.5 text-sm leading-snug text-mist"
                    initial={reduced ? false : { opacity: 0.65, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px" }}
                    transition={{ duration: 0.35, delay: reduced ? 0 : Math.min(index * 0.03, 0.28) }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <LeetCodeStats />
      </div>
    </section>
  );
}
