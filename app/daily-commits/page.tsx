"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = { file: string; mtimeMs: number; size: number };

function fmtTime(ms: number) {
 try {
 return new Date(ms).toISOString();
 } catch {
 return "-";
 }
}

export default function DailyCommitsPage() {
 const [items, setItems] = useState<Item[]>([]);
 const [err, setErr] = useState<string | null>(null);

 async function load() {
 setErr(null);
 try {
 const r = await fetch("/api/daily-commits", { cache: "no-store" });
 const j = await r.json();
 if (!r.ok) throw new Error(j?.error || "Failed to load");
 setItems(j.items || []);
 } catch (e: any) {
 setErr(String(e?.message || e));
 }
 }

 useEffect(() => {
 load().catch(() => {});
 }, []);

 return (
 <main className="min-h-screen bg-slate-950 text-slate-50">
 <div className="mx-auto max-w-5xl px-6 py-10">
 <div className="flex items-center justify-between gap-3">
 <div>
 <h1 className="text-2xl font-semibold">Daily Commits</h1>
 <p className="mt-2 text-sm text-slate-400">
 List of generated daily commit bundles from <span className="font-mono">docs/commits</span>.
 </p>
 </div>
 <div className="flex gap-2">
 <Link
 href="/daily-commit"
 className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm hover:bg-slate-800/40 transition"
 >
 Open verifier
 </Link>
 <button
 onClick={() => load()}
 className="inline-flex items-center justify-center rounded-full border border-amber-400/40 bg-black/30 hover:bg-amber-500/10 text-sm font-medium transition-all px-5 py-2"
 >
 Refresh
 </button>
 </div>
 </div>

 {err && (
 <div className="mt-6 rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">
 {err}
 </div>
 )}

 <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
 {items.length === 0 ? (
 <div className="text-slate-400 text-sm">No commit files found.</div>
 ) : (
 <div className="divide-y divide-slate-800">
 {items.map((it) => (
 <div key={it.file} className="py-3 flex items-center justify-between gap-3">
 <div className="min-w-0">
 <div className="font-mono text-sm text-slate-100 truncate">{it.file}</div>
 <div className="text-[12px] text-slate-400">
 {fmtTime(it.mtimeMs)} · {it.size} bytes
 </div>
 </div>
 <Link
 href={`/daily-commit?file=${encodeURIComponent(it.file)}`}
 className="shrink-0 inline-flex items-center justify-center rounded-full border border-emerald-600/60 bg-emerald-600/10 px-4 py-2 text-sm hover:bg-emerald-600/20 transition"
 >
 Verify
 </Link>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </main>
 );
}
