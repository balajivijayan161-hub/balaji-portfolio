import { Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { contact } from "../data/portfolio.js";
import { SectionHeading } from "./SectionHeading.jsx";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 254, message: 2000 };

function fieldErrors(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();
  if (name.length < 2) errors.name = "Enter your name (at least 2 characters).";
  else if (name.length > LIMITS.name) errors.name = `Use at most ${LIMITS.name} characters.`;
  if (email.length > LIMITS.email) errors.email = `Use at most ${LIMITS.email} characters.`;
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
  if (message.length < 10) errors.message = "Enter a message of at least 10 characters.";
  else if (message.length > LIMITS.message) errors.message = `Use at most ${LIMITS.message} characters.`;
  return errors;
}

export function Contact() {
  const key = (import.meta.env.VITE_WEB3FORMS_KEY || "").trim();
  const [values, setValues] = useState({ name: "", email: "", message: "", company: "", botcheck: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [statusText, setStatusText] = useState("");

  function update(event) {
    const { name, value, type, checked } = event.target;
    const limit = LIMITS[name];
    const next = typeof limit === "number" ? value.slice(0, limit) : value;
    setValues((current) => ({ ...current, [name]: type === "checkbox" ? checked : next }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const nextErrors = fieldErrors(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      setStatusText("");
      return;
    }

    if (values.company.trim() || values.botcheck) {
      setStatus("success");
      setStatusText("Message sent.");
      return;
    }

    if (!key) {
      const body = `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`;
      const href = `mailto:${contact.email}?subject=${encodeURIComponent(`Portfolio message from ${values.name.trim()}`)}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      setStatus("success");
      setStatusText(`Your email app should open with this message addressed to Balaji. If it does not, write to ${contact.email}.`);
      return;
    }

    setStatus("loading");
    setStatusText("");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: key,
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          subject: `Portfolio message from ${values.name.trim()}`,
          from_name: values.name.trim(),
          botcheck: false,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || "Request failed");
      }
      setStatus("success");
      setStatusText("Message sent.");
      setValues({ name: "", email: "", message: "", company: "", botcheck: false });
    } catch {
      setStatus("error");
      setStatusText(`The message could not be sent. Email ${contact.email} directly.`);
    }
  }

  return (
    <section id={contact.id} className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <SectionHeading index={contact.index} eyebrow={contact.eyebrow} title={contact.title}>
            {contact.intro}
          </SectionHeading>
          <ul className="mt-8 space-y-3 text-mist">
            <li>
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-3 hover:text-cyan">
                <Mail aria-hidden="true" className="h-5 w-5 text-cyan" />
                {contact.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-3">
              <MapPin aria-hidden="true" className="h-5 w-5 text-cyan" />
              <span>{contact.location}</span>
            </li>
          </ul>
        </div>

        <form onSubmit={onSubmit} noValidate className="relative rounded-2xl border border-white/10 bg-panel/80 p-5 sm:p-6">
          <div className="grid gap-4">
            <div>
              <label htmlFor="contact-name" className="text-sm text-mist">
                {contact.form.nameLabel}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={update}
                maxLength={LIMITS.name}
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "contact-name-error contact-name-count" : "contact-name-count"}
                className="mt-1 h-12 w-full rounded-xl border border-white/25 bg-ink px-3 text-white"
              />
              <p id="contact-name-count" className="mt-1 text-right text-xs text-muted">
                {values.name.length}/{LIMITS.name}
              </p>
              {errors.name ? (
                <p id="contact-name-error" className="mt-1 text-sm text-red-300">
                  {errors.name}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="contact-email" className="text-sm text-mist">
                {contact.form.emailLabel}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={update}
                maxLength={LIMITS.email}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "contact-email-error contact-email-count" : "contact-email-count"}
                className="mt-1 h-12 w-full rounded-xl border border-white/25 bg-ink px-3 text-white"
              />
              <p id="contact-email-count" className="mt-1 text-right text-xs text-muted">
                {values.email.length}/{LIMITS.email}
              </p>
              {errors.email ? (
                <p id="contact-email-error" className="mt-1 text-sm text-red-300">
                  {errors.email}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="contact-message" className="text-sm text-mist">
                {contact.form.messageLabel}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={values.message}
                onChange={update}
                maxLength={LIMITS.message}
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "contact-message-error contact-message-count" : "contact-message-count"}
                className="mt-1 w-full rounded-xl border border-white/25 bg-ink px-3 py-3 text-white"
              />
              <p id="contact-message-count" className="mt-1 text-right text-xs text-muted">
                {values.message.length}/{LIMITS.message}
              </p>
              {errors.message ? (
                <p id="contact-message-error" className="mt-1 text-sm text-red-300">
                  {errors.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="contact-company">{contact.form.honeypotLabel}</label>
            <input
              id="contact-company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.company}
              onChange={update}
            />
            <input name="botcheck" type="checkbox" tabIndex={-1} checked={values.botcheck} onChange={update} />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-cyan px-5 font-medium text-ink hover:bg-white disabled:cursor-wait disabled:opacity-70"
          >
            {status === "loading" ? contact.form.sendingLabel : contact.form.submitLabel}
          </button>
          <p className="sr-only" aria-live="polite">
            {statusText}
          </p>
          {statusText ? (
            <p className={`mt-3 text-sm ${status === "error" ? "text-red-300" : "text-emerald-300"}`} role="status">
              {statusText}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
