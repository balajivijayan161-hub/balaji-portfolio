import { LogOut } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../auth/auth-context.js";
import { visitorAvatar, visitorInitials, visitorLabel } from "../lib/visitors.js";

const NOTE = "Signing in saves your name, email and sign-in time so Balaji can see who visited.";

function devPreview(name) {
  if (!import.meta.env.DEV) return false;
  return new URLSearchParams(window.location.search).get("preview") === name;
}

function GoogleMark() {
  return (
    <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full border border-white/50 text-xs font-semibold">
      G
    </span>
  );
}

function Avatar({ user }) {
  const [failed, setFailed] = useState(false);
  const src = visitorAvatar(user);
  const label = visitorLabel(user);
  const initials = visitorInitials(label, user?.email);
  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        width="32"
        height="32"
        className="h-8 w-8 rounded-full object-cover"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="grid h-8 w-8 place-items-center rounded-full border border-cyan/40 bg-navy font-mono text-xs text-cyan"
    >
      {initials}
    </span>
  );
}

function SignInDialog({ onClose }) {
  const { configured, signInWithGoogle, sendMagicLink } = useAuth();
  const titleId = useId();
  const noteId = useId();
  const ref = useRef(null);
  const closeRef = useRef(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState("");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  async function onGoogle() {
    setError("");
    setNotice("");
    if (!configured) {
      setError("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before signing in.");
      return;
    }
    setPending("google");
    const { error: authError } = await signInWithGoogle();
    setPending("");
    if (authError) setError(authError.message);
  }

  async function onEmail(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!configured) {
      setError("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before signing in.");
      return;
    }
    setPending("email");
    const { error: authError } = await sendMagicLink(trimmed);
    setPending("");
    if (authError) {
      setError(authError.message);
      return;
    }
    setNotice("Check that inbox for a sign-in link.");
  }

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={noteId}
      className="m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-mist"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div
        data-backdrop="true"
        className="flex min-h-full items-end justify-center p-3 sm:items-center sm:p-6"
        onClick={(event) => {
          if (event.target instanceof HTMLElement && event.target.dataset.backdrop === "true") onClose();
        }}
      >
        <div className="w-full max-w-md rounded-2xl border border-cyan/30 bg-navy p-5 shadow-2xl sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-2xl font-semibold text-white">
              Sign in
            </h2>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-mist hover:border-cyan hover:text-cyan"
            >
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close sign-in</span>
            </button>
          </div>
          <p id={noteId} className="mt-3 text-sm leading-relaxed text-muted">
            {NOTE}
          </p>
          <button
            type="button"
            onClick={onGoogle}
            disabled={pending !== ""}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-cyan/40 text-sm font-medium text-white hover:bg-cyan/10 disabled:opacity-60"
          >
            <GoogleMark />
            {pending === "google" ? "Opening Google…" : "Continue with Google"}
          </button>
          <p className="my-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted">or</p>
          <form onSubmit={onEmail} noValidate className="grid gap-3">
            <div>
              <label htmlFor="sign-in-email" className="text-sm text-mist">
                Email
              </label>
              <input
                id="sign-in-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 h-12 w-full rounded-xl border border-white/25 bg-ink px-3 text-white"
              />
            </div>
            <button
              type="submit"
              disabled={pending !== ""}
              className="inline-flex h-12 items-center justify-center rounded-full bg-cyan px-5 font-medium text-ink hover:bg-white disabled:opacity-60"
            >
              {pending === "email" ? "Sending…" : "Email me a sign-in link"}
            </button>
          </form>
          {error ? (
            <p className="mt-3 text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="mt-3 text-sm text-emerald-300" role="status">
              {notice}
            </p>
          ) : null}
        </div>
      </div>
    </dialog>,
    document.body,
  );
}

function SignedIn({ variant }) {
  const { user, signOut } = useAuth();
  const label = visitorLabel(user);
  if (variant === "menu") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-3">
        <span className="flex min-w-0 items-center gap-2">
          <Avatar user={user} />
          <span className="truncate text-sm text-mist">{label}</span>
        </span>
        <button type="button" onClick={() => signOut()} className="text-sm text-cyan hover:text-white">
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-2" title={label}>
        <Avatar user={user} />
        <span className="sr-only">{label}</span>
      </span>
      <button
        type="button"
        onClick={() => signOut()}
        className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 text-sm text-muted hover:border-cyan/50 hover:text-cyan"
      >
        <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
        Sign out
      </button>
    </div>
  );
}

export function SignInHost() {
  const { signInOpen, closeSignIn, user } = useAuth();
  if (!signInOpen || user) return null;
  return <SignInDialog onClose={closeSignIn} />;
}

export function AuthControls({ variant = "desktop", onNavigate }) {
  const { configured, user, openSignIn } = useAuth();
  const preview = devPreview("signin");
  if (!configured && !preview) return null;

  if (user) return <SignedIn variant={variant} />;

  function openModal() {
    onNavigate?.();
    openSignIn();
  }

  const buttonClass =
    variant === "menu"
      ? "inline-flex h-12 w-full items-center justify-center rounded-full border border-line text-sm text-mist hover:border-cyan/50 hover:text-cyan"
      : "inline-flex h-9 items-center rounded-full border border-line px-3 text-sm text-muted hover:border-cyan/50 hover:text-cyan";

  return (
    <div className={variant === "menu" ? "grid gap-2" : undefined}>
      <button type="button" className={buttonClass} onClick={openModal}>
        Sign in
      </button>
      {variant === "menu" ? <p className="text-xs leading-relaxed text-muted">{NOTE}</p> : null}
    </div>
  );
}
