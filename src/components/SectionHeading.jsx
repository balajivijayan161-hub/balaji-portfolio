export function SectionHeading({ index, eyebrow, title, children }) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan">
        {index} <span className="text-muted">/ {eyebrow}</span>
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white text-balance sm:text-4xl">{title}</h2>
      {children ? <p className="mt-3 text-base leading-relaxed text-muted">{children}</p> : null}
    </div>
  );
}
