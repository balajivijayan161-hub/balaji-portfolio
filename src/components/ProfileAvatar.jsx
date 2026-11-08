import { useState } from "react";

export function ProfileAvatar({ photo, className = "" }) {
  const [failed, setFailed] = useState(!photo?.src);

  return (
    <div className={`pcb-frame relative ${className}`}>
      <div className="absolute -inset-3 rounded-[1.6rem] border border-cyan/20" aria-hidden="true" />
      <div className="relative grid aspect-[10/13] w-64 place-items-center overflow-hidden rounded-2xl border border-cyan/40 bg-navy shadow-[0_0_40px_rgba(94,231,255,0.12)] sm:w-80 lg:w-[22.5rem]">
        {!failed ? (
          <img
            src={photo.src}
            alt={photo.alt}
            width="1200"
            height="1560"
            className="h-full w-full object-contain"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            role="img"
            aria-label={`${photo.alt}, initials ${photo.initials}`}
            className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_20%,#16324a,transparent_55%),linear-gradient(160deg,#101c2e,#071018)]"
          >
            <span className="font-mono text-5xl font-medium tracking-wide text-cyan sm:text-6xl" aria-hidden="true">
              {photo.initials}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
