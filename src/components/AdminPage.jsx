import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/auth-context.js";
import { AuthControls } from "./AuthControls.jsx";
import { getSupabase } from "../lib/supabase.js";
import { displayText, downloadCsv, formatIst, visitorsToCsv } from "../lib/visitors.js";

export function AdminShell({ children }) {
  return (
    <div className="relative z-10 min-h-screen">
      <header className="border-b border-white/10 bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <a href="/" className="font-mono text-sm tracking-[0.18em] text-cyan">
            BV
          </a>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted hover:text-white">
              Portfolio
            </a>
            <AuthControls />
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {children}
      </main>
    </div>
  );
}

export function AdminSetup() {
  return (
    <AdminShell>
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan">Admin</p>
      <h1 className="mt-3 text-3xl font-semibold text-white text-balance sm:text-4xl">Visitor sign-in is not connected</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        The portfolio still works. Sign-in stays hidden until these environment variables are set, then restart the dev server or redeploy:
      </p>
      <ol className="mt-4 max-w-2xl list-decimal space-y-2 pl-5 text-mist">
        <li>
          <code className="text-cyan">VITE_SUPABASE_URL</code>
        </li>
        <li>
          <code className="text-cyan">VITE_SUPABASE_ANON_KEY</code> — the anon public key, not the service role key
        </li>
      </ol>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        After that, run <code className="text-cyan">supabase/schema.sql</code> in the Supabase SQL editor and turn on Google and email sign-in. The README has the full steps.
      </p>
    </AdminShell>
  );
}

export function NotAuthorised({ email }) {
  return (
    <AdminShell>
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan">Admin</p>
      <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Not authorised</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">
        {email
          ? `You are signed in as ${email}. This list is only for the site owner.`
          : "Sign in with the site owner account to see who has visited. The rest of the portfolio stays open without an account."}
      </p>
      <div className="mt-6">{email ? null : <AuthControls variant="menu" />}</div>
    </AdminShell>
  );
}

function providerLabel(provider) {
  if (!provider) return "";
  if (provider === "google") return "Google";
  if (provider === "email") return "Email";
  return provider;
}

export function VisitorDashboard({ rows, notice }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = [...rows].sort((a, b) => String(b.last_seen).localeCompare(String(a.last_seen)));
    if (!needle) return list;
    return list.filter((row) => `${displayText(row.name)} ${displayText(row.email)}`.toLowerCase().includes(needle));
  }, [query, rows]);
  const signIns = rows.reduce((sum, row) => sum + Number(row.login_count || 0), 0);

  function exportCsv() {
    downloadCsv("visitor-logins.csv", visitorsToCsv(filtered));
  }

  return (
    <AdminShell>
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan">Admin</p>
      <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Visitors</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        People who chose to sign in. Times are India Standard Time.
      </p>
      {notice ? (
        <p className="mt-4 rounded-xl border border-cyan/30 bg-cyan/10 px-3 py-2 text-sm text-cyan" role="note">
          {notice}
        </p>
      ) : null}
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-panel/80 p-4">
          <dt className="text-xs uppercase tracking-[0.16em] text-muted">Unique visitors</dt>
          <dd className="mt-1 text-3xl font-semibold text-white">{rows.length}</dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-panel/80 p-4">
          <dt className="text-xs uppercase tracking-[0.16em] text-muted">Sign-ins</dt>
          <dd className="mt-1 text-3xl font-semibold text-white">{signIns}</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label htmlFor="visitor-search" className="text-sm text-mist">
            Search
          </label>
          <input
            id="visitor-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name or email"
            className="mt-1 h-12 w-full rounded-xl border border-white/25 bg-ink px-3 text-white"
          />
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="inline-flex h-12 items-center justify-center rounded-full border border-cyan/40 px-5 text-sm text-cyan hover:bg-cyan/10 disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>
      {filtered.length === 0 ? (
        <p className="mt-8 text-muted">{rows.length === 0 ? "No one has signed in yet." : "No matches."}</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <caption className="sr-only">People who signed in, newest first</caption>
            <thead className="bg-panel/80 text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Email</th>
                <th scope="col" className="px-4 py-3 font-medium">Provider</th>
                <th scope="col" className="px-4 py-3 font-medium">Last seen (IST)</th>
                <th scope="col" className="px-4 py-3 font-medium">Sign-ins</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.user_id} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white">{displayText(row.name) || "—"}</td>
                  <td className="px-4 py-3">{displayText(row.email) || "—"}</td>
                  <td className="px-4 py-3">{providerLabel(row.provider)}</td>
                  <td className="px-4 py-3">
                    <time dateTime={row.last_seen}>{formatIst(row.last_seen)}</time>
                  </td>
                  <td className="px-4 py-3">{row.login_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

function AdminLive() {
  const { ready, user, isAdmin, adminChecked, adminError } = useAuth();
  const [rows, setRows] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!ready || !adminChecked || !isAdmin) return undefined;
    let active = true;
    getSupabase().then((supabase) => {
      if (!active || !supabase) return null;
      return supabase
      .from("visitor_summary")
      .select("user_id,name,email,avatar_url,provider,first_seen,last_seen,login_count")
      .order("last_seen", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setLoadError(error.message);
          setRows([]);
          return;
        }
        setRows(data || []);
      });
    });
    return () => {
      active = false;
    };
  }, [adminChecked, isAdmin, ready]);

  if (!ready || (user && !adminChecked)) {
    return (
      <AdminShell>
        <p className="text-muted">Checking access…</p>
      </AdminShell>
    );
  }

  if (adminError) {
    return (
      <AdminShell>
        <h1 className="text-3xl font-semibold text-white">Visitor list unavailable</h1>
        <p className="mt-3 max-w-xl text-muted">
          Signed in, but the admin check failed. Run <code className="text-cyan">supabase/schema.sql</code> in the Supabase SQL editor if you have not yet.
        </p>
        <p className="mt-3 text-sm text-red-300">{adminError}</p>
      </AdminShell>
    );
  }

  if (!user || !isAdmin) {
    return <NotAuthorised email={user?.email || ""} />;
  }

  if (loadError) {
    return (
      <AdminShell>
        <h1 className="text-3xl font-semibold text-white">Could not load visitors</h1>
        <p className="mt-3 text-sm text-red-300">{loadError}</p>
      </AdminShell>
    );
  }

  if (!rows) {
    return (
      <AdminShell>
        <p className="text-muted">Loading visitors…</p>
      </AdminShell>
    );
  }

  return <VisitorDashboard rows={rows} />;
}

export function AdminPage() {
  const { configured } = useAuth();
  if (!configured) return <AdminSetup />;
  return <AdminLive />;
}
