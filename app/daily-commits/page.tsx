"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CommitItem = {
  projectId: string;
  reportHash: string;
  engineCodeHash: string;
  engineVersionHash: string;
  validator: string;
  messageHash: string;
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
};

function short(value: string, left = 10, right = 8) {
  if (!value) return "-";
  if (value.length <= left + right + 3) return value;
  return `${value.slice(0, left)}...${value.slice(-right)}`;
}

function formatTime(timestamp: number) {
  try {
    return new Date(timestamp * 1000).toLocaleString();
  } catch {
    return "-";
  }
}

export default function DailyCommitsPage() {
  const [items, setItems] = useState<CommitItem[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [registryAddress, setRegistryAddress] = useState("");
  const [latestBlock, setLatestBlock] = useState<number | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);

    try {
      const response = await fetch("/api/daily-commits", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load on-chain commits");
      }

      setItems(data.items || []);
      setRegistryAddress(data.registryAddress || "");
      setLatestBlock(data.latestBlock ?? null);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Daily Commits</h1>

            <p className="mt-2 text-sm text-slate-400">
              Commit records read directly from the DDCCommitRegistry on BNB Chain.
            </p>

            {registryAddress && (
              <p className="mt-1 text-xs text-slate-500">
                Registry:{" "}
                <a
                  href={`https://bscscan.com/address/${registryAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-emerald-400 hover:underline"
                >
                  {short(registryAddress)}
                </a>
                {latestBlock !== null && (
                  <span> · scanned through block {latestBlock}</span>
                )}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              href="/daily-commit"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm transition hover:bg-slate-800/40"
            >
              Open verifier
            </Link>

            <button
              onClick={() => load()}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full border border-amber-400/40 bg-black/30 px-5 py-2 text-sm font-medium transition-all hover:bg-amber-500/10 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {err && (
          <div className="mt-6 rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">
            {err}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          {loading && items.length === 0 ? (
            <div className="text-sm text-slate-400">
              Reading commits from BNB Chain...
            </div>
          ) : items.length === 0 ? (
            <div className="text-sm text-slate-400">
              No on-chain commits found.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {items.map((item) => (
                <div
                  key={`${item.transactionHash}-${item.reportHash}`}
                  className="py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <div className="text-sm font-medium text-slate-100">
                        {formatTime(item.timestamp)}
                      </div>

                      <div className="text-xs text-slate-400">
                        Block {item.blockNumber}
                      </div>

                      <div className="text-xs text-slate-400">
                        Report hash:{" "}
                        <span className="font-mono text-slate-200">
                          {short(item.reportHash, 14, 10)}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400">
                        Validator:{" "}
                        <span className="font-mono text-slate-200">
                          {short(item.validator)}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`https://bscscan.com/tx/${item.transactionHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 inline-flex items-center justify-center rounded-full border border-emerald-600/60 bg-emerald-600/10 px-4 py-2 text-sm transition hover:bg-emerald-600/20"
                    >
                      View on BscScan
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
