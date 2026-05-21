"use client";

import { Contract, JsonRpcProvider, formatUnits } from "ethers";
import { useEffect, useMemo, useState } from "react";
import {
 RPC_URL,
 CHAIN_ID,
 PRESALE_VESTING_ADDRESS,
 REWARD_POOL_ADDRESS,
 DDC_TOKEN_ADDRESS,
} from "@/app/config/contracts";
import { DDC_PRESALE_ABI } from "@/app/abi/ddcPresaleVesting";
import { ERC20_ABI } from "@/app/abi/erc20";

type Data = {
 finalized: boolean;
 finalizedAt?: number;

 rewardPool: string;

 // Progress
 totalSoldNominal: bigint;
 purchasesCount: number;

 // Batch state
 currentBatch: number;
 baseHardCap: bigint; // batch #1 hardcap (base)
 curHardCap: bigint;
 curSold: bigint;

 // Batch 40 snapshot (on-chain current)
 hardCap40: bigint;
 sold40: bigint;
 end40?: number;

 // Projection (if from NOW onward sold=0 and only time-expiry advances happen)
 projectedHardCap40: bigint;

 // Final-only
 unsoldToRewardsFinal: bigint;
 unsoldMovedFinal: bigint;
};

type State =
 | { status: "idle" | "loading"; data?: undefined; error?: undefined }
 | { status: "success"; data: Data; error?: undefined }
 | { status: "error"; error: string; data?: undefined };

const ZERO = "0x0000000000000000000000000000000000000000";

function pickLikelyDDCAmount(args: unknown): bigint | null {
 if (!args || typeof args !== "object") return null;
 const vals = Object.values(args as Record<string, unknown>);
 const candidates: bigint[] = [];
 for (const v of vals) if (typeof v === "bigint") candidates.push(v);
 if (!candidates.length) return null;
 const filtered = candidates.filter((x) => x > 10_000n);
 const arr = filtered.length ? filtered : candidates;
 return arr.reduce((a, b) => (b > a ? b : a), arr[0]);
}

function fmt18(v: bigint) {
 const n = Number(formatUnits(v, 18));
 return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 6 }) : "—";
}

export default function PresaleFinalizeStatus() {
 const [st, setSt] = useState<State>({ status: "idle" });

 const provider = useMemo(() => new JsonRpcProvider(RPC_URL, CHAIN_ID), []);
 const presaleAddr = (PRESALE_VESTING_ADDRESS as string) || ZERO;
 const rewardPoolAddr = (REWARD_POOL_ADDRESS as string) || ZERO;
 const ddcAddr = (DDC_TOKEN_ADDRESS as string) || ZERO;

 useEffect(() => {
 let alive = true;

 const run = async () => {
 try {
 if (!presaleAddr || presaleAddr === ZERO) {
 setSt({ status: "error", error: "Presale address is not configured (NEXT_PUBLIC_PRESALE_ADDRESS)." });
 return;
 }
 if (!rewardPoolAddr || rewardPoolAddr === ZERO) {
 setSt({ status: "error", error: "RewardPool address is not configured (NEXT_PUBLIC_REWARD_POOL_ADDRESS)." });
 return;
 }

 setSt({ status: "loading" });

 const presale: any = new Contract(presaleAddr, ((DDC_PRESALE_ABI as any).abi ?? DDC_PRESALE_ABI) as any, provider);
 const blk = await provider.getBlock("latest");
 const now = Number(blk?.timestamp ?? Math.floor(Date.now() / 1000));

 // (A) Progress: total sold from Purchased events
 let totalSoldNominal = 0n;
 let purchasesCount = 0;
 try {
 const logs = await presale.queryFilter(presale.filters.Purchased?.(), 0, "latest");
 purchasesCount = logs?.length ?? 0;
 if (logs && logs.length) {
 for (const l of logs as any[]) {
 const amt = pickLikelyDDCAmount(l.args);
 if (amt) totalSoldNominal += amt;
 }
 }
 } catch {}

 // (B) batch #1 base hardCap (used for projection)
 let baseHardCap = 0n;
 try {
 const b1: any = await presale.batchInfo(1);
 baseHardCap = (b1.hardCapDDC ?? b1[2] ?? 0n) as bigint;
 } catch {}

 // (C) current batch snapshot
 let currentBatch = 1;
 let curHardCap = 0n;
 let curSold = 0n;
 try {
 currentBatch = Number(await presale.currentBatch());
 const bCur: any = await presale.batchInfo(currentBatch);
 curHardCap = (bCur.hardCapDDC ?? bCur[2] ?? 0n) as bigint;
 curSold = (bCur.soldDDC ?? bCur[3] ?? 0n) as bigint;
 } catch {}

 // (D) batch #40 on-chain snapshot (CURRENT; not projection)
 let hardCap40 = 0n;
 let sold40 = 0n;
 let end40: number | undefined;
 try {
 const b40: any = await presale.batchInfo(40);
 hardCap40 = (b40.hardCapDDC ?? b40[2] ?? 0n) as bigint;
 sold40 = (b40.soldDDC ?? b40[3] ?? 0n) as bigint;
 const e40: bigint = (b40.endTime ?? b40[5] ?? 0n) as bigint;
 end40 = e40 > 0n ? Number(e40) : undefined;
 } catch {}

 // (E) Finalized?
 let finalized = false;
 let finalizedAt: number | undefined;

 try {
 const logs = await presale.queryFilter(presale.filters.PresaleFinished?.(), 0, "latest");
 if (logs && logs.length) {
 finalized = true;
 const last: any = logs[logs.length - 1];
 const soldFromFinish = (last.args?.[0] ?? 0n) as bigint;
 if (soldFromFinish > 0n) totalSoldNominal = soldFromFinish;

 const b = await provider.getBlock(last.blockNumber);
 finalizedAt = b?.timestamp ? Number(b.timestamp) : undefined;
 }
 } catch {}

 if (!finalized && typeof end40 === "number" && end40 > 0 && now >= end40) {
 finalized = true;
 finalizedAt = end40;
 }

 // (F) Projection: what would hardCap#40 become if from NOW onward sold=0
 // Rollover rule: cap_{i+1} = base + (cap_i - sold_i) (on time expiry)
 let projectedHardCap40 = hardCap40;
 if (!finalized && baseHardCap > 0n) {
 if (currentBatch >= 40) {
 projectedHardCap40 = curHardCap;
 } else {
 const unsoldCur = curHardCap > curSold ? (curHardCap - curSold) : 0n;
 // next cap if current expires:
 const nextCap = baseHardCap + unsoldCur;
 const remainingSteps = 40 - currentBatch; // number of advances needed to reach 40
 if (remainingSteps <= 1) {
 projectedHardCap40 = nextCap;
 } else {
 // each further step (assuming sold=0) adds baseHardCap
 projectedHardCap40 = nextCap + baseHardCap * BigInt(remainingSteps - 1);
 }
 }
 }

 // (G) Final-only values
 let unsoldToRewardsFinal = 0n;
 let unsoldMovedFinal = 0n;

 if (finalized) {
 unsoldToRewardsFinal = hardCap40 > sold40 ? (hardCap40 - sold40) : 0n;

 if (ddcAddr && ddcAddr !== ZERO) {
 try {
 const token: any = new Contract(ddcAddr, ERC20_ABI as any, provider);
 const logs = await token.queryFilter(token.filters.Transfer?.(presaleAddr, rewardPoolAddr), 0, "latest");
 if (logs && logs.length) {
 for (const l of logs as any[]) {
 const v = l.args?.value;
 if (typeof v === "bigint") unsoldMovedFinal += v;
 else if (v?.toString) unsoldMovedFinal += BigInt(v.toString());
 }
 }
 } catch {}
 }
 if (unsoldMovedFinal === 0n) unsoldMovedFinal = unsoldToRewardsFinal;
 }

 const data: Data = {
 finalized,
 finalizedAt,
 rewardPool: rewardPoolAddr,

 totalSoldNominal,
 purchasesCount,

 currentBatch,
 baseHardCap,
 curHardCap,
 curSold,

 hardCap40,
 sold40,
 end40,

 projectedHardCap40,

 unsoldToRewardsFinal,
 unsoldMovedFinal,
 };

 if (!alive) return;
 setSt({ status: "success", data });
 } catch (e: any) {
 if (!alive) return;
 setSt({ status: "error", error: e?.message ?? "Presale finalize read error" });
 }
 };

 run();
 const t = setInterval(run, 5000);
 return () => {
 alive = false;
 clearInterval(t);
 };
 }, [provider, presaleAddr, rewardPoolAddr, ddcAddr]);

 const Row = ({ label, value }: { label: string; value: string }) => (
 <div className="flex items-center justify-between py-2 border-b border-amber-400/15 last:border-b-0">
 <span className="text-xs text-amber-100/70">{label}</span>
 <span className="text-sm font-semibold text-amber-200">{value}</span>
 </div>
 );

 const fmtTs = (ts?: number) => (typeof ts === "number" && ts > 0 ? new Date(ts * 1000).toLocaleString() : "—");

 return (
 <div className="mt-6">
 <div className="mb-2">
 <h3 className="text-lg font-semibold text-amber-200">Presale finalize status</h3>
 <p className="text-sm text-amber-100/70">
 During the presale: progress and projections are displayed. Final "unsold → RewardPool" reconciliation occurs only after Batch 40.
 </p>
 </div>

 <div className="rounded-2xl border border-amber-500/40 bg-black/40 p-5 shadow-lg">
 {st.status === "idle" && <div className="text-sm text-amber-100/70">—</div>}
 {st.status === "loading" && <div className="text-sm text-amber-100/70">Loading…</div>}
 {st.status === "error" && <div className="text-sm text-red-400">{st.error}</div>}

 {st.status === "success" && (
 <div className="text-sm">
 <Row label="Finalized" value={st.data.finalized ? "Yes" : "No"} />
 <Row label="Finalized at" value={fmtTs(st.data.finalizedAt)} />
 <Row label="RewardPool" value={st.data.rewardPool} />

 <div className="mt-4 pt-3 border-t border-amber-400/20 text-xs text-amber-100/60">
 Live progress
 </div>
 <Row label="Total sold (Purchased events)" value={`${fmt18(st.data.totalSoldNominal)} DDC`} />
 <Row label="Purchases (events)" value={String(st.data.purchasesCount)} />

 <div className="mt-4 pt-3 border-t border-amber-400/20 text-xs text-amber-100/60">
 Live rollover projection
 </div>
 <Row label="Current batch" value={`#${st.data.currentBatch}`} />
 <Row label="Base hardCap (batch #1)" value={`${fmt18(st.data.baseHardCap)} DDC`} />
 <Row label="Current hardCap" value={`${fmt18(st.data.curHardCap)} DDC`} />
 <Row label="Current sold" value={`${fmt18(st.data.curSold)} DDC`} />
 <Row
 label="Projected Batch #40 hardCap (if future sold=0)"
 value={`${fmt18(st.data.projectedHardCap40)} DDC`}
 />

 <div className="mt-4 pt-3 border-t border-amber-400/20 text-xs text-amber-100/60">
 Batch #40 on-chain snapshot (current)
 </div>
 <Row label="Batch #40 hardCap (current on-chain)" value={`${fmt18(st.data.hardCap40)} DDC`} />
 <Row label="Batch #40 sold" value={`${fmt18(st.data.sold40)} DDC`} />
 <Row label="Batch #40 endTime" value={fmtTs(st.data.end40)} />

 {!st.data.finalized ? (
 <div className="mt-3 text-[11px] text-amber-100/55">
 Note: hardCap #40 on-chain increases only when the rollover reaches 39→40. The projection above shows the expected value if there are no further sales from now on.
 </div>
 ) : (
 <>
 <div className="mt-4 pt-3 border-t border-amber-400/20 text-xs text-amber-100/60">
 Final (after Batch 40)
 </div>
 <Row label="Unsold → RewardPool (final)" value={`${fmt18(st.data.unsoldToRewardsFinal)} DDC`} />
 <Row label="Unsold moved (Transfer or derived)" value={`${fmt18(st.data.unsoldMovedFinal)} DDC`} />
 </>
 )}
 </div>
 )}
 </div>
 </div>
 );
}
