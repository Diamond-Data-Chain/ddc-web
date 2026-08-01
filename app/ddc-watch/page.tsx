"use client";

import { useEffect, useMemo, useState } from "react";

type Category =
  | "Regulation"
  | "Corporate"
  | "Software"
  | "Research";

type RecordStatus =
  | "Preserved"
  | "Verified"
  | "Changed"
  | "Review";

type VerificationCheck = {
  label: string;
  score: number;
  maximum: number;
  status: "pass" | "warning" | "review";
};

type DDCWatchRecord = {
  recordId: string;
  ddcTokenRecordNumber: string;
  category: Category;
  status: RecordStatus;
  sourceName: string;
  sourceDomain: string;
  documentTitle: string;
  documentUrl: string;
  detectedAt: string;
  publishedAt: string;
  contentHash: string;
  previousHash?: string;
  previousRecordId?: string;
  changeDetected: boolean;
  verificationConfidence: number;
  blockchainTx?: string;
  blockNumber?: number;
  summary: string;
  checks: VerificationCheck[];
};

const INITIAL_RECORDS: DDCWatchRecord[] = [];

const FILTERS = [
  "All",
  "Regulation",
  "Corporate",
  "Software",
  "Research",
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(value));
}

function shortHash(value?: string) {
  if (!value) return "—";
  return `${value.slice(0, 12)}…${value.slice(-10)}`;
}

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();

  if (!Number.isFinite(timestamp)) {
    return "Unknown";
  }

  const seconds = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / 1000)
  );

  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function statusClasses(status: RecordStatus) {
  if (status === "Preserved") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  }

  if (status === "Verified") {
    return "border-cyan-400/30 bg-cyan-400/10 text-cyan-300";
  }

  if (status === "Changed") {
    return "border-amber-400/30 bg-amber-400/10 text-amber-300";
  }

  return "border-rose-400/30 bg-rose-400/10 text-rose-300";
}

function checkClasses(status: VerificationCheck["status"]) {
  if (status === "pass") return "text-emerald-300";
  if (status === "warning") return "text-amber-300";
  return "text-rose-300";
}

export default function DDCWatchPage() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]>("All");

  const [records, setRecords] =
    useState<DDCWatchRecord[]>(INITIAL_RECORDS);

  const [selectedRecord, setSelectedRecord] =
    useState<DDCWatchRecord | null>(null);

  const [loadingRecords, setLoadingRecords] =
    useState(true);

  const [recordsError, setRecordsError] =
    useState("");

  const [lastScan, setLastScan] =
    useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function loadRecords() {
      try {
        setLoadingRecords(true);
        setRecordsError("");

        const response = await fetch(
          "/api/ddc-watch-records",
          { cache: "no-store" }
        );

        const body = await response.json();

        if (!response.ok) {
          throw new Error(
            body.error || "Unable to load DDC Watch records."
          );
        }

        if (!alive) return;

        const items = Array.isArray(body.items)
          ? body.items
          : [];

        setRecords(items);
        setLastScan(
          typeof body.lastScan === "string"
            ? body.lastScan
            : null
        );

        setSelectedRecord((current) => {
          if (
            current &&
            items.some(
              (item: DDCWatchRecord) =>
                item.recordId === current.recordId
            )
          ) {
            return current;
          }

          return items[0] || null;
        });
      } catch (error) {
        if (!alive) return;

        setRecordsError(
          error instanceof Error
            ? error.message
            : "Unable to load DDC Watch records."
        );
      } finally {
        if (alive) {
          setLoadingRecords(false);
        }
      }
    }

    void loadRecords();

    const interval = window.setInterval(
      loadRecords,
      30000
    );

    return () => {
      alive = false;
      window.clearInterval(interval);
    };
  }, []);

  const recordById = useMemo(() => {
    return new Map(
      records.map((record) => [record.recordId, record])
    );
  }, [records]);

  const filteredRecords = useMemo(() => {
    if (activeFilter === "All") return records;

    return records.filter(
      (record) => record.category === activeFilter
    );
  }, [activeFilter, records]);

  const preservedCount = records.filter(
    (record) =>
      record.status === "Preserved" ||
      record.status === "Verified"
  ).length;

  const changedCount = records.filter(
    (record) => record.changeDetected
  ).length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070b] text-slate-100">
      <div className="pointer-events-none fixed inset-0 opacity-50">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:46px_46px]" />
        <div className="absolute left-1/4 top-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-[440px] w-[440px] rounded-full bg-amber-500/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-amber-400/20 bg-slate-950/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                </span>

                <span className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-300">
                  Live public verification network
                </span>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                DDC Watch
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                Public documents, releases and disclosures are
                monitored, hashed and preserved as individually
                registered DDC Token records. DDC Watch verifies the
                source, integrity and publication context without
                claiming that the content itself is true.
              </p>
            </div>

            <div className="grid min-w-[320px] gap-3 text-xs text-slate-400 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-black/30 p-4">
                <div className="uppercase tracking-wider">
                  Network
                </div>
                <div className="mt-2 font-mono text-sm text-emerald-300">
                  BNB Chain · Connected
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-black/30 p-4">
                <div className="uppercase tracking-wider">
                  Registry
                </div>
                <div className="mt-2 font-mono text-sm text-cyan-300">
                  DDC Token Recorder
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-black/30 p-4">
                <div className="uppercase tracking-wider">
                  Last scan
                </div>
                <div className="mt-2 font-mono text-sm text-slate-200">
                  {lastScan
                    ? formatRelativeTime(lastScan)
                    : "Waiting for first scan"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-black/30 p-4">
                <div className="uppercase tracking-wider">
                  Monitoring
                </div>
                <div className="mt-2 font-mono text-sm text-amber-300">
                  4 source classes
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Records monitored",
              value: String(records.length),
              note: "Official sources currently monitored",
            },
            {
              label: "Verification reports",
              value: String(records.length),
              note: "Reports completed",
            },
            {
              label: "Changes detected",
              value: String(changedCount),
              note: "New document versions",
            },
            {
              label: "Records preserved",
              value: String(preservedCount),
              note: "Integrity confirmed",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-amber-400/20 bg-slate-950/75 p-5 shadow-xl shadow-black/30"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {stat.label}
              </div>

              <div className="mt-3 font-mono text-3xl text-amber-200">
                {stat.value}
              </div>

              <div className="mt-2 text-xs text-slate-500">
                {stat.note}
              </div>
            </div>
          ))}
        </section>

        {recordsError && (
          <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-300">
            {recordsError}
          </div>
        )}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-amber-400/20 bg-slate-950/75 p-5 shadow-2xl shadow-black/30">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold text-amber-100">
                  Live event feed
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Public-source monitoring and DDC Token registration.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      activeFilter === filter
                        ? "border-amber-400/50 bg-amber-400/15 text-amber-200"
                        : "border-slate-800 bg-black/20 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {filteredRecords.map((record) => {
                const selected =
                  selectedRecord?.recordId === record.recordId;

                return (
                  <button
                    key={record.recordId}
                    type="button"
                    onClick={() => setSelectedRecord(record)}
                    className={`w-full rounded-2xl border p-4 text-left transition duration-300 ${
                      selected
                        ? "translate-y-[-2px] border-amber-400/50 bg-amber-400/[0.07]"
                        : "border-slate-800 bg-black/20 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-slate-900/70"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClasses(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>

                          <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-400">
                            {record.category}
                          </span>

                          <span className="font-mono text-[11px] text-cyan-400">
                            {record.ddcTokenRecordNumber}
                          </span>
                        </div>

                        <h3 className="mt-3 text-base font-semibold text-slate-100">
                          {record.documentTitle}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span>{record.sourceName}</span>
                          <span>{record.sourceDomain}</span>
                          <span>
                            {formatDate(record.detectedAt)}
                          </span>
                        </div>

                        {record.previousRecordId && (
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono text-slate-500">
                              Supersedes{" "}
                              {recordById.get(record.previousRecordId)
                                ?.ddcTokenRecordNumber ||
                                record.previousRecordId}
                            </span>
                            <span className="text-slate-600">→</span>
                            <span className="font-mono text-emerald-300">
                              Current {record.ddcTokenRecordNumber}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 text-left lg:text-right">
                        <div className="text-xs uppercase tracking-wider text-slate-500">
                          Verification confidence
                        </div>

                        <div className="mt-2 font-mono text-2xl text-amber-200">
                          {record.verificationConfidence}
                          <span className="text-sm text-slate-500">
                            /100
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedRecord ? (
          <aside className="rounded-3xl border border-amber-400/25 bg-slate-950/85 p-5 shadow-2xl shadow-black/40 xl:sticky xl:top-6 xl:self-start">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-amber-300">
                  Verification report
                </div>

                <div className="mt-2 font-mono text-sm text-cyan-300">
                  {selectedRecord.ddcTokenRecordNumber}
                </div>
              </div>

              <span
                className={`rounded-full border px-3 py-1.5 text-xs ${statusClasses(
                  selectedRecord.status
                )}`}
              >
                {selectedRecord.status}
              </span>
            </div>

            <h2 className="mt-5 text-xl font-semibold leading-snug">
              {selectedRecord.documentTitle}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {selectedRecord.summary}
            </p>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-black/30 p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">
                    Verification confidence
                  </div>

                  <div className="mt-2 font-mono text-4xl text-amber-200">
                    {selectedRecord.verificationConfidence}
                    <span className="text-lg text-slate-500">
                      /100
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-500">
                  Evidence-based
                  <br />
                  scoring
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-300"
                  style={{
                    width: `${selectedRecord.verificationConfidence}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {selectedRecord.checks.map((check) => (
                <div
                  key={check.label}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-black/20 px-4 py-3"
                >
                  <span className="text-sm text-slate-400">
                    {check.label}
                  </span>

                  <span
                    className={`font-mono text-sm ${checkClasses(
                      check.status
                    )}`}
                  >
                    {check.score}/{check.maximum}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 border-t border-slate-800 pt-5 text-sm">
              {[
                ["DDC Record ID", selectedRecord.recordId],
                ["Source", selectedRecord.sourceName],
                ["Domain", selectedRecord.sourceDomain],
                [
                  "Detected",
                  formatDate(selectedRecord.detectedAt),
                ],
                [
                  "Published",
                  formatDate(selectedRecord.publishedAt),
                ],
                [
                  "Content hash",
                  shortHash(selectedRecord.contentHash),
                ],
                [
                  "Previous hash",
                  shortHash(selectedRecord.previousHash),
                ],
                [
                  "Change detected",
                  selectedRecord.changeDetected ? "Yes" : "No",
                ],
                [
                  "Transaction",
                  shortHash(selectedRecord.blockchainTx),
                ],
                [
                  "Block",
                  selectedRecord.blockNumber
                    ? String(selectedRecord.blockNumber)
                    : "Pending",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-1 sm:grid-cols-[135px_1fr]"
                >
                  <div className="text-xs uppercase tracking-wider text-slate-600">
                    {label}
                  </div>

                  <div className="break-all font-mono text-xs text-slate-300">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-800 pt-5">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                Evidence Timeline
              </div>

              <div className="mt-4 rounded-2xl border border-slate-800 bg-black/20 p-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.65)]" />
                    {selectedRecord.previousRecordId && (
                      <span className="mt-2 h-full w-px bg-slate-700" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-sm text-cyan-300">
                      {selectedRecord.ddcTokenRecordNumber}
                    </div>
                    <div className="mt-1 text-xs font-medium text-emerald-300">
                      Current preserved version
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {formatDate(selectedRecord.detectedAt)}
                    </div>

                    {selectedRecord.previousRecordId ? (
                      <div className="mt-5 border-t border-slate-800 pt-4">
                        <div className="font-mono text-xs text-slate-400">
                          {recordById.get(selectedRecord.previousRecordId)
                            ?.ddcTokenRecordNumber ||
                            selectedRecord.previousRecordId}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Superseded preserved version
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs">
                          <span className="font-mono text-slate-500">
                            {recordById.get(selectedRecord.previousRecordId)
                              ?.ddcTokenRecordNumber ||
                              selectedRecord.previousRecordId}
                          </span>
                          <span className="text-slate-600">→</span>
                          <span className="font-mono text-emerald-300">
                            {selectedRecord.ddcTokenRecordNumber}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 text-xs text-slate-500">
                        First preserved version. No previous record exists.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <a
              href={selectedRecord.documentUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex w-full items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-200 transition hover:border-amber-300/70 hover:bg-amber-400/15"
            >
              Open original source
            </a>
          </aside>
          ) : (
            <aside className="rounded-3xl border border-amber-400/25 bg-slate-950/85 p-8 text-center text-sm text-slate-500">
              {loadingRecords
                ? "Loading verified DDC Watch records..."
                : "No DDC Watch record selected."}
            </aside>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-amber-400/20 bg-slate-950/75 p-6">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-cyan-400">
                DDC Token registration
              </div>

              <h2 className="mt-3 text-2xl font-semibold">
                Every monitored item receives its own permanent
                record number.
              </h2>
            </div>

            <p className="text-sm leading-7 text-slate-400">
              DDC Watch does not use the DDC coin as a document
              identifier. Each monitored event is registered as a
              separate DDC Token record containing its source,
              timestamp, document hash, verification checks and change
              history. The DDC coin remains the economic asset of the
              future network.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
