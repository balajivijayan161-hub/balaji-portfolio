import { useEffect, useState } from "react";
import { leetcode } from "../data/portfolio.js";

const REQUEST_TIMEOUT_MS = 6000;
const OVERALL_TIMEOUT_MS = 10000;

const ENDPOINTS = [
  {
    url: `https://leetcode-api-faisalshohag.vercel.app/${encodeURIComponent(leetcode.username)}`,
    read(data) {
      return {
        total: data.totalSolved,
        easy: data.easySolved,
        medium: data.mediumSolved,
        hard: data.hardSolved,
      };
    },
  },
  {
    url: `https://alfa-leetcode-api.onrender.com/${encodeURIComponent(leetcode.username)}/solved`,
    read(data) {
      return {
        total: data.solvedProblem,
        easy: data.easySolved,
        medium: data.mediumSolved,
        hard: data.hardSolved,
      };
    },
  },
];

function asCount(value) {
  return Number.isInteger(value) && value >= 0 ? value : null;
}

function readCounts(data, read) {
  if (!data || typeof data !== "object") return null;
  const counts = read(data);
  const total = asCount(counts.total);
  const easy = asCount(counts.easy);
  const medium = asCount(counts.medium);
  const hard = asCount(counts.hard);
  if (total == null || easy == null || medium == null || hard == null) return null;
  return { total, easy, medium, hard };
}

async function fetchWithTimeout(url, overallSignal, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onOverall = () => controller.abort();
  if (overallSignal.aborted) controller.abort();
  else overallSignal.addEventListener("abort", onOverall);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
    overallSignal.removeEventListener("abort", onOverall);
  }
}

async function loadStats(unmountSignal) {
  const overall = new AbortController();
  const overallTimer = setTimeout(() => overall.abort(), OVERALL_TIMEOUT_MS);
  const onUnmount = () => overall.abort();
  if (unmountSignal.aborted) overall.abort();
  else unmountSignal.addEventListener("abort", onUnmount);

  try {
    let lastError = null;
    for (const endpoint of ENDPOINTS) {
      if (unmountSignal.aborted) throw new DOMException("The stats request was cancelled.", "AbortError");
      if (overall.signal.aborted) throw new Error("LeetCode stats timed out.");
      try {
        const response = await fetchWithTimeout(endpoint.url, overall.signal, REQUEST_TIMEOUT_MS);
        if (!response.ok) throw new Error(String(response.status));
        const counts = readCounts(await response.json(), endpoint.read);
        if (!counts) throw new Error("unexpected shape");
        return counts;
      } catch (error) {
        if (unmountSignal.aborted) throw error;
        if (overall.signal.aborted) throw new Error("LeetCode stats timed out.");
        lastError = error;
      }
    }
    throw lastError ?? new Error("leetcode stats unavailable");
  } finally {
    clearTimeout(overallTimer);
    unmountSignal.removeEventListener("abort", onUnmount);
  }
}

function ProfileLink() {
  return (
    <a href={leetcode.href} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan underline-offset-4 hover:underline">
      View LeetCode profile
    </a>
  );
}

export function LeetCodeStats() {
  const [state, setState] = useState({ status: "loading", counts: null });

  useEffect(() => {
    const controller = new AbortController();
    loadStats(controller.signal)
      .then((counts) => {
        if (!controller.signal.aborted) setState({ status: "ready", counts });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ status: "error", counts: null });
      });
    return () => controller.abort();
  }, []);

  return (
    <article className="pcb-frame mt-5 rounded-2xl border border-white/10 bg-panel/80 p-5" aria-busy={state.status === "loading"}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">LeetCode</h3>
        <p className="font-mono text-xs text-muted">{leetcode.username}</p>
      </div>
      {state.status === "loading" ? <p className="mt-4 text-sm text-muted">Loading LeetCode stats…</p> : null}
      {state.status === "ready" && state.counts ? (
        <div className="mt-4">
          <p className="text-sm text-muted">Solved</p>
          <p className="mt-1 text-3xl font-semibold text-white">{state.counts.total}</p>
          <dl className="mt-4 grid max-w-sm grid-cols-3 gap-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted">Easy</dt>
              <dd className="mt-1 text-xl font-semibold text-mist">{state.counts.easy}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted">Medium</dt>
              <dd className="mt-1 text-xl font-semibold text-mist">{state.counts.medium}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted">Hard</dt>
              <dd className="mt-1 text-xl font-semibold text-mist">{state.counts.hard}</dd>
            </div>
          </dl>
          <div className="mt-4">
            <ProfileLink />
          </div>
        </div>
      ) : null}
      {state.status === "error" ? (
        <div className="mt-4">
          <ProfileLink />
        </div>
      ) : null}
    </article>
  );
}
