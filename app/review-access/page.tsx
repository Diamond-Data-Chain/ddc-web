"use client";

import { FormEvent, useState } from "react";

export default function ReviewAccessPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/seven-rol-review/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        setError(data?.error ?? "Access denied.");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const requestedPath = params.get("next");
      const destination =
        requestedPath?.startsWith("/seven-rol-mapping")
          ? requestedPath
          : "/seven-rol-mapping";

      window.location.assign(destination);
    } catch {
      setError("Unable to verify access code.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-slate-100">
      <div className="mx-auto max-w-lg">
        <div className="rounded-3xl border border-sky-500/20 bg-slate-900/80 p-7 shadow-2xl shadow-sky-950/20">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-violet-300">
              Private review
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-400">
              Pilot v0.2
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            Seven ROL → DDC Mapping Pilot
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Restricted architecture-review access. This is a prototype mapping
            workbench, not a production Seven ROL integration.
          </p>

          <form onSubmit={submitAccess} className="mt-7">
            <label className="mb-2 block text-sm font-semibold text-slate-200">
              Review access code
            </label>

            <input
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoComplete="off"
              autoFocus
              placeholder="Enter access code"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-base text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-500"
            />

            {error && (
              <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !code.trim()}
              className="mt-4 w-full rounded-xl bg-sky-500 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Checking access..." : "Open review workbench"}
            </button>
          </form>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Access is provided only to invited reviewers. The workbench is
            intentionally marked as prototype and contains unresolved fields
            where upstream information is not yet available.
          </p>
        </div>
      </div>
    </main>
  );
}
