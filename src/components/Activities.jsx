import { Award, CircuitBoard, Code2, Radio, Users } from "lucide-react";
import { useState } from "react";
import { activities, activitiesSection } from "../data/portfolio.js";
import { SectionHeading } from "./SectionHeading.jsx";

const ICONS = {
  users: Users,
  award: Award,
  circuit: CircuitBoard,
  code: Code2,
  radio: Radio,
};

function ActivityPhoto({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <p className="rounded-lg border border-white/10 px-3 py-6 text-center text-sm text-muted">Image not found</p>;
  }
  return (
    <img
      src={src}
      alt={alt}
      className="aspect-[4/3] w-full rounded-lg object-cover"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export function Activities() {
  return (
    <section id={activitiesSection.id} className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index={activitiesSection.index} eyebrow={activitiesSection.eyebrow} title={activitiesSection.title} />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((item) => {
            const Icon = ICONS[item.icon] ?? Award;
            const hasPhotos = item.photos.length > 0;
            return (
              <li key={item.id}>
                <article className="pcb-frame h-full rounded-2xl border border-white/10 bg-panel/80 p-5">
                  {hasPhotos ? (
                    <ul className="mb-4 grid grid-cols-2 gap-2">
                      {item.photos.map((file, photoIndex) => (
                        <li key={file} className={item.photos.length === 1 ? "col-span-2" : undefined}>
                          <ActivityPhoto
                            src={`/images/activities/${item.slug}/${file}`}
                            alt={`${item.title}, photo ${photoIndex + 1}`}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Icon aria-hidden="true" className="h-8 w-8 text-cyan" />
                  )}
                  <h3 className={`text-lg font-semibold text-white ${hasPhotos ? "" : "mt-6"}`}>{item.title}</h3>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
