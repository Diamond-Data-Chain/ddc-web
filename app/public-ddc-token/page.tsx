'use client';

import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

const RECORDER_ABI = [
 'function getGlobalPurchaseCount(bytes32 projectId) view returns (uint256)',
 'function listGlobalPurchases(bytes32 projectId,uint256 offset,uint256 limit) view returns (tuple(uint256 ddcAmount,address payAsset,uint256 payAmount,uint8 payMethod,bytes32 memoHash,bytes32 sourceRef,uint64 ts)[])',
];

function short(a?: string) {
 if (!a) return '-';
 return a.slice(0, 6) + '…' + a.slice(-4);
}

async function copyText(s: string): Promise<boolean> {
 try {
 await navigator.clipboard.writeText(s);
 return true;
 } catch {
 return false;
 }
}

export default function PublicDDCTokenPage() {
 const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || '';
 const recorderAddr = process.env.NEXT_PUBLIC_RECORDER_ADDRESS || '';
 const projectKey = process.env.NEXT_PUBLIC_PROJECT_KEY || 'DDC_PROJECT_V1';
 const projectId = useMemo(() => ethers.keccak256(ethers.toUtf8Bytes(projectKey)), [projectKey]);

 const provider = useMemo(() => {
 if (!rpcUrl) return null;
 return new ethers.JsonRpcProvider(rpcUrl, undefined, { batchMaxCount: 1, batchStallTime: 0 });
 }, [rpcUrl]);

 const [limit, setLimit] = useState(1500);
 const [page, setPage] = useState(0);

 const [toast, setToast] = useState<string | null>(null);
 const [toastOk, setToastOk] = useState(true);
 const showToast = (msg: string, ok: boolean) => {
 setToastOk(ok);
 setToast(msg);
 window.setTimeout(() => setToast(null), 1200);
 };

 const [loading, setLoading] = useState(false);
 const [err, setErr] = useState<string | null>(null);
 const [rows, setRows] = useState<any[]>([]);
 const [count, setCount] = useState<number>(0);

 const BOT_MEMO = useMemo(() => ethers.keccak256(ethers.toUtf8Bytes("bot-sync")), []);
 const BACKFILL_MEMO = useMemo(() => ethers.keccak256(ethers.toUtf8Bytes("backfill")), []);
 const SMOKE_MEMO = useMemo(() => ethers.keccak256(ethers.toUtf8Bytes("smoke-global")), []);
 const [showAll, setShowAll] = useState(false);


 useEffect(() => {
 load();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 async function load() {
 setErr(null);
 setRows([]);
 setCount(0);

 try {
 if (!provider) throw new Error('RPC URL is missing.');
 if (!recorderAddr) throw new Error('Recorder address is missing.');

 const rec = ethers.getAddress(recorderAddr);
 const code = await provider.getCode(rec);
 if (code === '0x') throw new Error('Recorder contract is not deployed on this network.');

 const c = new ethers.Contract(rec, RECORDER_ABI, provider);

 setLoading(true);

 const n = await c.getGlobalPurchaseCount(projectId);
 const total = Number(n.toString());
 setCount(total);

 const endExclusive = Math.max(0, total - page * limit);
 const start = Math.max(0, endExclusive - limit);
 const size = endExclusive - start;

 const items = size > 0 ? await c.listGlobalPurchases(projectId, start, size) : [];

 const mapped = (items as any[]).map((it) => ({
 ts: Number(it.ts),
 ddc: BigInt(it.ddcAmount.toString()),
 payAsset: String(it.payAsset),
 payAmt: BigInt(it.payAmount.toString()),
 payMethod: Number(it.payMethod),
 sourceRef: String(it.sourceRef),
 })).reverse();

 // hide smoke/backfill by default (public RPC mode)
 const filtered = showAll
 ? mapped
 : mapped.filter((r: any) => {
 // default: show only real purchases (payAmount > 0)
 return (r.payAmt ?? 0n) > 0n;
 });

 setRows(filtered);
 } catch (e: any) {
 setErr(String(e?.shortMessage || e?.message || e));
 } finally {
 setLoading(false);
 }
 }

 return (
 <main className="min-h-screen bg-black text-amber-50">
 {toast && (
 <div
 className={
 'fixed top-4 right-4 z-[9999] rounded-xl border px-4 py-2 text-sm shadow-2xl ' +
 (toastOk
 ? 'border-emerald-600/50 bg-emerald-950/90 text-emerald-100'
 : 'border-red-600/50 bg-red-950/90 text-red-100')
 }
 >
 {toast}
 </div>
 )}

 <div className="mx-auto max-w-6xl px-6 py-10">
 <h1 className="text-2xl font-semibold text-amber-200">Public DDC Token</h1>
 <p className="mt-2 text-amber-100/70 text-sm">
 Public feed of presale purchases recorded in the DDC Recorder (on-chain). No RPC log scanning.
 </p>

 <div className="mt-6 rounded-2xl border border-amber-500/30 bg-black/35 p-5">
 <div className="flex flex-wrap items-center gap-3">
 <input
 className="w-28 rounded-xl border border-amber-500/40 bg-black/40 px-3 py-2 text-sm text-amber-200"
 value={String(limit)}
 onChange={(e) => setLimit(Math.max(1, Number(e.target.value || '1')))}
 title="Rows per page"
 />

 <button
 onClick={() => load()}
 disabled={loading}
 className="inline-flex items-center justify-center rounded-full border border-amber-500/40 bg-black/40 px-4 py-2 text-sm hover:bg-black/30/40 transition disabled:opacity-50"
 >
 {loading ? 'Loading…' : 'Refresh'}
 </button>

 <label className="ml-2 inline-flex items-center gap-2 text-xs text-amber-100/70">
 <input
 type="checkbox"
 className="h-4 w-4 accent-slate-300"
 checked={showAll}
 onChange={(e) => setShowAll(e.target.checked)}
 />
 Show test/backfill
 </label>

 <div className="ml-auto text-xs text-amber-100/70">Total records: {count}</div>
 </div>

 {err && (
 <div className="mt-4 rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">
 {err}
 </div>
 )}

 <div className="mt-4 flex items-center justify-end gap-2">
 <button
 className="rounded-full border border-amber-500/40 bg-black/40 px-3 py-1 text-xs hover:bg-black/30/40 disabled:opacity-50"
 onClick={() => setPage((p) => Math.max(0, p - 1))}
 disabled={page <= 0}
 >
 Newer
 </button>
 <button
 className="rounded-full border border-amber-500/40 bg-black/40 px-3 py-1 text-xs hover:bg-black/30/40 disabled:opacity-50"
 onClick={() => setPage((p) => p + 1)}
 disabled={(page + 1) * limit >= count}
 >
 Older
 </button>
 </div>

 <div className="mt-4 overflow-x-auto">
 <table className="w-full text-left text-sm">
 <thead className="text-xs text-amber-100/70">
 <tr className="border-b border-amber-500/30">
 <th className="py-2 pr-3">Time</th>
 <th className="py-2 pr-3">DDC</th>
 <th className="py-2 pr-3">Paid</th>
 <th className="py-2 pr-3">Asset</th>
 <th className="py-2 pr-3">SourceRef (click to copy)</th>
 </tr>
 </thead>
 <tbody className="text-amber-100/80">
 {rows.map((r, i) => (
 <tr key={i} className="border-t border-amber-500/30">
 <td className="py-2 pr-3 font-mono">{r.ts ? new Date(r.ts * 1000).toISOString() : '-'}</td>
 <td className="py-2 pr-3 font-mono">{ethers.formatUnits(r.ddc, 18)}</td>
 <td className="py-2 pr-3 font-mono">
 {r.payMethod === 1 ? ethers.formatUnits(r.payAmt, 6) : r.payMethod === 2 ? ethers.formatUnits(r.payAmt, 18) : "0"}
 </td>
 <td className="py-2 pr-3 font-mono">{short(r.payAsset)}</td>
 <td className="py-2 pr-3 font-mono">
 <button
 type="button"
 className="underline decoration-amber-500/40 hover:decoration-amber-200 underline-offset-4 hover:text-amber-200"
 onClick={async () => showToast((await copyText(r.sourceRef)) ? 'Copied!' : 'Copy failed', true)}
 title={r.sourceRef}
 >
 {short(r.sourceRef)}
 </button>
 </td>
 </tr>
 ))}
 {rows.length === 0 && !err && (
 <tr>
 <td className="py-3 text-amber-100/70" colSpan={5}>
 No records yet. Click Refresh.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>

 <div className="mt-3 text-xs text-amber-500">
 Recorder: {recorderAddr || '(missing)'} · ProjectKey: {projectKey}
 </div>
 </div>
 </div>
 </main>
 );
}
