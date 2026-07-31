"use client";

import { useCallback, useEffect, useState } from "react";

type CommitItem = {
  sha: string;
  shortSha: string;
  title: string;
  description: string;
  url: string;
  date: string | null;
  author: string;
  authorUrl: string | null;
  avatarUrl: string | null;
  verified: boolean;
  verificationReason: string | null;
};

type CommitsResponse = {
  source: string;
  repository: string;
  branch: string;
  repositoryUrl?: string;
  count: number;
  items: CommitItem[];
  error?: string;
};

function formatDate(value: string | null): string {
  if (!value) return "Unknown date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export default function DailyCommitsPage() {
  const [data, setData] = useState<CommitsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCommits = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/daily-commits", {
        cache: "no-store",
      });

      const body = (await response.json()) as CommitsResponse;

      if (!response.ok) {
        throw new Error(
          body.error || "Unable to load GitHub commits."
        );
      }

      setData(body);
    } catch (loadError: unknown) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load GitHub commits."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCommits();
  }, [loadCommits]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
              Development transparency
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Daily Commits
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Public development history read directly from the
              Diamond Data Chain GitHub repository. Each entry links
              to the original commit and its complete change history.
            </p>

            {data && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                <span className="rounded-full border border-slate-700 px-3 py-1">
                  Repository: {data.repository}
                </span>

                <span className="rounded-full border border-slate-700 px-3 py-1">
                  Branch: {data.branch}
                </span>

                <span className="rounded-full border border-slate-700 px-3 py-1">
                  Showing: {data.count}
                </span>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <a
              href={
                data?.repositoryUrl ||
                "https://github.com/Diamond-Data-Chain/ddc-web"
              }
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
            >
              Open GitHub
            </a>

            <button
              type="button"
              onClick={() => void loadCommits()}
              disabled={loading}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </section>

      {loading && !data && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8 text-center text-slate-400">
          Reading commits from GitHub...
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-900/70 bg-red-950/30 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && data?.items.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8 text-center text-slate-400">
          No GitHub commits found.
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="space-y-4">
          {data.items.map((commit) => (
            <article
              key={commit.sha}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-slate-700"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-sm text-cyan-400 hover:underline"
                    >
                      {commit.shortSha}
                    </a>

                    {commit.verified && (
                      <span className="rounded-full border border-emerald-800 bg-emerald-950/50 px-2 py-0.5 text-xs text-emerald-300">
                        Verified
                      </span>
                    )}
                  </div>

                  <h2 className="break-words text-lg font-semibold text-slate-100">
                    {commit.title}
                  </h2>

                  {commit.description && (
                    <p className="mt-2 break-words text-sm leading-6 text-slate-400">
                      {commit.description}
                    </p>
                  )}
                </div>

                <a
                  href={commit.url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:bg-slate-900"
                >
                  View commit
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-800 pt-4 text-xs text-slate-500">
                <span>{formatDate(commit.date)}</span>

                {commit.authorUrl ? (
                  <a
                    href={commit.authorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-slate-300 hover:underline"
                  >
                    Author: {commit.author}
                  </a>
                ) : (
                  <span>Author: {commit.author}</span>
                )}

                <span className="font-mono">
                  {commit.sha}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
