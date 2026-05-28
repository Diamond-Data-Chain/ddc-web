"use client";

import { Contract, JsonRpcProvider, formatUnits } from "ethers";
import { useEffect, useMemo, useState } from "react";
import {
 RPC_URL,
 CHAIN_ID,
 PRESALE_VESTING_ADDRESS,
 REWARD_POOL_ADDRESS,
} from "@/app/config/contracts";
import { DDC_PRESALE_ABI } from "@/app/abi/ddcPresaleVesting";

type Data = {
 finalized: boolean;

 soldNominal: bigint; // Purchased events sum
 burnLockedSoFar: bigint; // sold/2 (progress during presale)
 remainingBurnNeed: bigint; // 51.2M - burnLockedSoFar (>=0)

 // Final reconciliation (only after finalize)
 unsoldFinal: bigint; // batch40 hardCap - sold40
 presaleToPoolFinal: bigint; // unsoldFinal + sold/2
 burnLockedFinal: bigint; // min(51.2M, presaleToPoolFinal)
 validatorEligibleFinal: bigint; // presaleToPoolFinal - burnLockedFinal

 burnTarget: bigint;
 eventsCount: number;
 updatedAt: number;
 rewardPoolAddr: string;
};

type State =
 | { status: "idle" | "loading"; data?: undefined; error?: undefined }
 | { status: "success"; data: Data; error?: undefined }
 | { status: "error"; error: string; data?: undefined };

const ZERO = "0x0000000000000000000000000000000000000000";
const BURN_TARGET = 51_200_000n * 10n ** 18n;

function fmt18(v: bigint) {
 const n = Number(formatUnits(v, 18));
 return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 6 }) : "—";
}

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

export default function RewardPoolStatus() {
 const [st, setSt] = useState<State>({ status: "idle" });

 const provider = useMemo(() => new JsonRpcProvider(RPC_URL, CHAIN_ID), []);
 const presaleAddr = (PRESALE_VESTING_ADDRESS as string) || ZERO;
 const rewardPoolAddr = (REWARD_POOL_ADDRESS as string) || ZERO;

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

 setSt((prev) =>
 prev.status === "idle" ? { status: "loading" } : prev
 );

 const presale: any = new Contract(presaleAddr, ((DDC_PRESALE_ABI as any).abi ?? DDC_PRESALE_ABI) as any, provider);
 const blk = await provider.getBlock("latest");
 const now = Number(blk?.timestamp ?? Math.floor(Date.now() / 1000));

 // 1) Sold nominal from Purchased events
 let soldNominal = 0n;
 let eventsCount = 0;
 try {
 const logs = await presale.queryFilter(presale.filters.Purchased?.(), 0, "latest");
 eventsCount = logs?.length ?? 0;
 if (logs && logs.length) {
 for (const l of logs as any[]) {
 const amt = pickLikelyDDCAmount(l.args);
 if (amt) soldNominal += amt;
 }
 }
 } catch {}

 // During presale: burn locked progress = sold/2
 let burnLockedSoFar = soldNominal / 2n;
 if (burnLockedSoFar > BURN_TARGET) burnLockedSoFar = BURN_TARGET;

 const remainingBurnNeed = BURN_TARGET > burnLockedSoFar ? (BURN_TARGET - burnLockedSoFar) : 0n;

 // 2) Finalized? prefer PresaleFinished event; fallback: batch40 ended
 let finalized = false;

 try {
 const logs = await presale.queryFilter(presale.filters.PresaleFinished?.(), 0, "latest");
 if (logs && logs.length) finalized = true;
 } catch {}

 // fallback: batch 40 time ended
 let unsoldFinal = 0n;
 try {
 const b40: any = await presale.batchInfo(40);
 const hardCap40: bigint = (b40.hardCapDDC ?? b40[2] ?? 0n) as bigint;
 const sold40: bigint = (b40.soldDDC ?? b40[3] ?? 0n) as bigint;
 const end40: bigint = (b40.endTime ?? b40[5] ?? 0n) as bigint;

 if (!finalized && end40 > 0n && BigInt(now) >= end40) finalized = true;

 if (finalized) {
 unsoldFinal = hardCap40 > sold40 ? (hardCap40 - sold40) : 0n;
 }
 } catch {}

 // 3) Final reconciliation (only if finalized)
 const presaleToPoolFinal = finalized ? (unsoldFinal + (soldNominal / 2n)) : 0n;
 const burnLockedFinal = finalized ? (presaleToPoolFinal > BURN_TARGET ? BURN_TARGET : presaleToPoolFinal) : 0n;
 const validatorEligibleFinal = finalized ? (presaleToPoolFinal > burnLockedFinal ? (presaleToPoolFinal - burnLockedFinal) : 0n) : 0n;

 const data: Data = {
 finalized,

 soldNominal,
 burnLockedSoFar,
 remainingBurnNeed,

 unsoldFinal,
 presaleToPoolFinal,
 burnLockedFinal,
 validatorEligibleFinal,

 burnTarget: BURN_TARGET,
 eventsCount,
 updatedAt: now,
 rewardPoolAddr,
 };

 if (!alive) return;
 setSt({ status: "success", data });
 } catch (e: any) {
 if (!alive) return;
 setSt({ status: "error", error: e?.message ?? "RewardPool read error" });
 }
 };

 run();
 const t = setInterval(run, 5000);
 return () => {
 alive = false;
 clearInterval(t);
 };
 }, [provider, presaleAddr, rewardPoolAddr]);

 const Row = ({ label, value }: { label: string; value: string }) => (
 <div className="flex items-center justify-between py-2 border-b border-amber-400/15 last:border-b-0">
 <span className="text-xs text-amber-100/70">{label}</span>
 <span className="text-sm font-semibold text-amber-200">{value}</span>
 </div>
 );

 return (
 <div className="mt-6">
 <div className="mb-2">
 <h3 className="text-lg font-semibold text-amber-200">Reward Pool</h3>
 <p className="text-sm text-amber-100/70">
 Read-only status. During the presale, progress is displayed as sold/2. After Batch 40, reconciliation is executed automatically with a 51.2M cap.
 </p>
 </div>

 <div className="rounded-2xl border border-amber-500/40 bg-black/40 p-5 shadow-lg min-h-[310px]">
 {st.status === "idle" && <div className="text-sm text-amber-100/70">—</div>}
 {st.status === "loading" && <div className="text-sm text-amber-100/70">Loading…</div>}
 {st.status === "error" && <div className="text-sm text-red-400">{st.error}</div>}

 {st.status === "success" && (
 <>
 {!st.data.finalized ? (
 <>
 <Row label="Burn-locked (so far = sold/2)" value={fmt18(st.data.burnLockedSoFar)} />
 <Row label="Validator rewards eligible (after finalize)" value={"0"} />
 <Row label="Presale burn accounted (so far)" value={fmt18(st.data.burnLockedSoFar)} />
 <Row label="Remaining presale burn need" value={fmt18(st.data.remainingBurnNeed)} />
 <Row label="Presale burn target" value={fmt18(st.data.burnTarget)} />
 <div className="mt-3 text-[11px] text-amber-100/55">
 Note: "unsold" is NOT counted toward burn/validator rewards until the presale ends (Batch 40 / PresaleFinished).
 </div>
 </>
 ) : (
 <>
 <Row label="Burn-locked (final, capped to 51.2M)" value={fmt18(st.data.burnLockedFinal)} />
 <Row label="Validator rewards eligible (final)" value={fmt18(st.data.validatorEligibleFinal)} />
 <Row label="Presale burn accounted (final)" value={fmt18(st.data.burnLockedFinal)} />
 <div className="mt-4 pt-3 border-t border-amber-400/20 text-xs text-amber-100/60">
 Transparent final inputs
 </div>
 <Row label="Sold nominal (Purchased events)" value={fmt18(st.data.soldNominal)} />
 <Row label="Unsold final (batch #40 hardCap - sold)" value={fmt18(st.data.unsoldFinal)} />
 <Row label="Presale→RewardPool final (unsold + sold/2)" value={fmt18(st.data.presaleToPoolFinal)} />
 <Row label="Presale burn target" value={fmt18(st.data.burnTarget)} />
 </>
 )}

 <div className="mt-2 text-[11px] text-amber-100/45">
 Events counted: {st.data.eventsCount} · Updated:{" "}
 {new Date(st.data.updatedAt * 1000).toLocaleString()}
 </div>
 </>
 )}
 </div>
 </div>
 );
}
