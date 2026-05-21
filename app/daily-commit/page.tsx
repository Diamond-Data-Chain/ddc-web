"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

const REGISTRY_ABI = [
 "function hasCommit(bytes32 projectId, bytes32 reportHash) view returns (bool)",
 "function computeMessageHash(bytes32 reportHash, bytes32 engineCodeHash, bytes32 engineVersionHash) pure returns (bytes32)",
 "function getCommit(bytes32 projectId, bytes32 reportHash) view returns (tuple(bytes32 reportHash,bytes32 engineCodeHash,bytes32 engineVersionHash,address validator,bytes32 messageHash,uint64 ts,uint64 blockNumber))",
];

type SignedCommit = {
 submitTxHash?: string;
 submitChainId?: number;

 standard?: string;
 engine?: { engineVersion?: string; engineCodeHash?: string };
 commit?: { eventCount?: number; eventHashes?: string[]; reportHash?: string };
 proofOfValidation?: {
 validatorId?: string;
 validatorAddress?: string;
 messageHash?: string;
 signature?: string;
 signatureType?: string;
 };
};

function short(a?: string) {
 if (!a) return "-";
 return a.slice(0, 6) + "…" + a.slice(-4);
}

function isHex32(x: any): x is string {
 return typeof x === "string" && /^0x[0-9a-fA-F]{64}$/.test(x);
}

async function copyText(s: string): Promise<boolean> {
 try {
 await navigator.clipboard.writeText(s);
 return true;
 } catch {
 try {
 const ta = document.createElement("textarea");
 ta.value = s;
 ta.setAttribute("readonly", "");
 ta.style.position = "fixed";
 ta.style.left = "-9999px";
 ta.style.top = "0";
 document.body.appendChild(ta);
 ta.select();
 const ok = document.execCommand("copy");
 document.body.removeChild(ta);
 return ok;
 } catch {
 return false;
 }
 }
}

export default function DailyCommitPage() {
 const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "";
 const registryAddr = process.env.NEXT_PUBLIC_COMMIT_REGISTRY_ADDRESS || "";
 const projectKey = process.env.NEXT_PUBLIC_PROJECT_KEY || "DDC_PROJECT_V1";
 const chainId = process.env.NEXT_PUBLIC_CHAIN_ID ? Number(process.env.NEXT_PUBLIC_CHAIN_ID) : 0;

 const projectId = useMemo(() => ethers.keccak256(ethers.toUtf8Bytes(projectKey)), [projectKey]);

 const explorerBase = useMemo(() => {
 // Default: BSC testnet explorer for chainId 97
 if (chainId === 97) return "https://testnet.bscscan.com";
 if (chainId === 56) return "https://bscscan.com";
 return ""; // optional
 }, [chainId]);

 const provider = useMemo(() => {
 if (!rpcUrl) return null;
 try {
 return new ethers.JsonRpcProvider(rpcUrl, undefined, { batchMaxCount: 1, batchStallTime: 0 });
 } catch {
 return null;
 }
 }, [rpcUrl]);

 const registry = useMemo(() => {
 if (!provider) return null;
 if (!registryAddr || !ethers.isAddress(registryAddr)) return null;
 return new ethers.Contract(registryAddr, REGISTRY_ABI, provider);
 }, [provider, registryAddr]);

 const [toast, setToast] = useState<string | null>(null);
 const [toastOk, setToastOk] = useState(true);
 const showToast = (msg: string, ok: boolean) => {
 setToastOk(ok);
 setToast(msg);
 window.setTimeout(() => setToast(null), 1200);
 };
 const copyAndToast = async (value: string) => {
 const ok = await copyText(value);
 showToast(ok ? "Copied!" : "Copy failed", ok);
 };

 const [jsonText, setJsonText] = useState<string>("");
 const [parsed, setParsed] = useState<SignedCommit | null>(null);

 const [err, setErr] = useState<string | null>(null);
 const [sigOk, setSigOk] = useState<boolean | null>(null);
 const [onchainOk, setOnchainOk] = useState<boolean | null>(null);
 const [expectedMsgHash, setExpectedMsgHash] = useState<string | null>(null);

 const [commitInfo, setCommitInfo] = useState<{
 validator: string;
 ts: number;
 blockNumber: number;
 engineCodeHash: string;
 engineVersionHash: string;
 messageHash: string;
 } | null>(null);

 const [txHash, setTxHash] = useState<string | null>(null);

 async function loadExample() {
 setErr(null);
 setCommitInfo(null);
 setTxHash(null);
 try {
 const r = await fetch("/api/daily-commit-example", { cache: "no-store" });
 const j = await r.json();
 if (!r.ok) throw new Error(j?.error || "Failed to load example");
 setJsonText(JSON.stringify(j, null, 2));
 setParsed(j);
 } catch (e: any) {
 setErr(String(e?.message || e));
 }
 }

 function parseNow() {
 setErr(null);
 setSigOk(null);
 setOnchainOk(null);
 setExpectedMsgHash(null);
 setCommitInfo(null);
 setTxHash(null);

 try {
 const j = JSON.parse(jsonText);
 setParsed(j);
 } catch (e: any) {
 setParsed(null);
 setErr("Invalid JSON: " + String(e?.message || e));
 }
 }

 async function findTxHashNearBlock(args: {
 reportHash: string;
 engineCodeHash: string;
 blockNumber: number;
 }) {
 if (!provider) return null;

 const { reportHash, engineCodeHash, blockNumber } = args;

 // CommitSubmitted(bytes32,bytes32,bytes32,bytes32,address,bytes32,uint64)
 const topic0 = ethers.id(
 "CommitSubmitted(bytes32,bytes32,bytes32,bytes32,address,bytes32,uint64)"
 );

 // Indexed topics: projectId, reportHash, engineCodeHash
 const filter = {
 address: registryAddr,
 topics: [topic0, projectId, reportHash, engineCodeHash],
 fromBlock: Math.max(0, blockNumber - 10),
 toBlock: blockNumber + 10,
 };

 try {
 const logs = await provider.getLogs(filter);
 if (!logs || logs.length === 0) return null;
 return logs[0].transactionHash || null;
 } catch {
 return null;
 }
 }

 async function verifyAll(commit: SignedCommit) {
 setErr(null);
 setSigOk(null);
 setOnchainOk(null);
 setExpectedMsgHash(null);
 setCommitInfo(null);
 setTxHash(null);

 try {
 const reportHash = commit?.commit?.reportHash;
 const engineCodeHash = commit?.engine?.engineCodeHash;
 const engineVersion = commit?.engine?.engineVersion || "";
 const validator = commit?.proofOfValidation?.validatorAddress;
 const messageHash = commit?.proofOfValidation?.messageHash;
 const signature = commit?.proofOfValidation?.signature;

 if (!isHex32(reportHash)) throw new Error("Bad commit.reportHash (must be 0x + 32 bytes)");
 if (!isHex32(engineCodeHash)) throw new Error("Bad engine.engineCodeHash (must be 0x + 32 bytes)");
 if (!validator || !ethers.isAddress(validator)) throw new Error("Bad proofOfValidation.validatorAddress");
 if (!isHex32(messageHash)) throw new Error("Bad proofOfValidation.messageHash (must be 0x + 32 bytes)");
 if (!signature || typeof signature !== "string" || !signature.startsWith("0x")) throw new Error("Bad proofOfValidation.signature");
 if (!engineVersion) throw new Error("Missing engine.engineVersion");

 // 1) Local signature verify (EIP-191 over bytes(messageHash))
 const recovered = ethers.verifyMessage(ethers.getBytes(messageHash), signature);
 const sigValid = recovered.toLowerCase() === validator.toLowerCase();
 setSigOk(sigValid);

 const engineVersionHash = ethers.keccak256(ethers.toUtf8Bytes(engineVersion));

 if (!registry) throw new Error("Commit registry not configured (check NEXT_PUBLIC_RPC_URL and NEXT_PUBLIC_COMMIT_REGISTRY_ADDRESS).");

 // 2) Deterministic messageHash check vs contract computeMessageHash
 const expected = await registry.computeMessageHash(reportHash, engineCodeHash, engineVersionHash);
 setExpectedMsgHash(expected);

 if (expected.toLowerCase() !== messageHash.toLowerCase()) {
 throw new Error(`messageHash mismatch. expected=${expected} json=${messageHash}`);
 }

 // 3) On-chain presence
 const ok = await registry.hasCommit(projectId, reportHash);
 setOnchainOk(Boolean(ok));

 // 4) If present, read commit record (cheap view) + attempt to find txHash in a very narrow range
 if (ok) {
 const rec = await registry.getCommit(projectId, reportHash);
 // ethers may return array-like; access by index as fallback
 const recValidator = (rec?.validator ?? rec?.[3] ?? "").toString();
 const recMsgHash = (rec?.messageHash ?? rec?.[4] ?? "").toString();
 const recTs = Number((rec?.ts ?? rec?.[5] ?? 0).toString());
 const recBlock = Number((rec?.blockNumber ?? rec?.[6] ?? 0).toString());
 const recEngineCodeHash = (rec?.engineCodeHash ?? rec?.[1] ?? "").toString();
 const recEngineVerHash = (rec?.engineVersionHash ?? rec?.[2] ?? "").toString();

 setCommitInfo({
 validator: recValidator,
 ts: recTs,
 blockNumber: recBlock,
 engineCodeHash: recEngineCodeHash,
 engineVersionHash: recEngineVerHash,
 messageHash: recMsgHash,
 });

 const foundTx = await findTxHashNearBlock({
 reportHash,
 engineCodeHash,
 blockNumber: recBlock,
 });
 setTxHash((commit as any)?.submitTxHash || foundTx);
 }
 } catch (e: any) {
 setErr(String(e?.shortMessage || e?.message || e));
 }
 }

 useEffect(() => {
 if (jsonText.trim().length > 0) {
 try {
 setParsed(JSON.parse(jsonText));
 } catch {}
 }
 }, [jsonText]);

 useEffect(() => {
 (async () => {
 try {
 const sp = new URLSearchParams(window.location.search);
 const file = sp.get("file");
 if (!file) return;
 const r = await fetch(`/api/daily-commit?file=${encodeURIComponent(file)}`, { cache: "no-store" });
 const j = await r.json();
 if (!r.ok) throw new Error(j?.error || "Failed to load commit file");
 const payload = j?.data ?? j;
 setJsonText(JSON.stringify(payload, null, 2));
 setParsed(payload);
 showToast(`Loaded: ${j?.file || file}`, true);
 await verifyAll(payload);
 } catch (e: any) {
 setErr(String(e?.message || e));
 }
 })();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);


 const reportHash = parsed?.commit?.reportHash || "";
 const txUrl = txHash && explorerBase ? `${explorerBase}/tx/${txHash}` : "";
 const contractUrl = registryAddr && explorerBase ? `${explorerBase}/address/${registryAddr}` : "";

 return (
 <main className="min-h-screen bg-slate-950 text-slate-50">
 {toast && (
 <div
 className={`fixed top-4 right-4 z-[9999] rounded-xl border px-4 py-2 text-sm shadow-2xl ${
 toastOk ? "border-emerald-600/50 bg-emerald-950/90 text-emerald-100" : "border-red-600/50 bg-red-950/90 text-red-100"
 }`}
 >
 {toast}
 </div>
 )}

 <div className="mx-auto max-w-5xl px-6 py-10">
 <h1 className="text-2xl font-semibold">Daily Commit Verification</h1>
 <p className="mt-2 text-sm text-slate-400">
 Verifies signed daily commit (EIP-191) and checks presence on-chain in <span className="font-mono">DDCCommitRegistry</span>.
 </p>

 <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
 <div className="flex flex-wrap gap-3 items-center">
 <button
 onClick={loadExample}
 className="inline-flex items-center justify-center rounded-full border border-amber-400/70 bg-black/40 hover:bg-amber-500/10 text-sm font-medium transition-all px-5 py-2"
 >
 Load example
 </button>

 <button
 onClick={async () => {
 setErr(null);
 setCommitInfo(null);
 setTxHash(null);
 try {
 const r = await fetch("/api/daily-commit-latest", { cache: "no-store" });
 const j = await r.json();
 if (!r.ok) throw new Error(j?.error || "Failed to load latest commit");
 const payload = j?.data ?? j;
 setJsonText(JSON.stringify(payload, null, 2));
 setParsed(payload);
 showToast(`Loaded latest: ${j?.file || "commit"}`, true);
 // auto-verify after load
 await verifyAll(payload);
 } catch (e: any) {
 setErr(String(e?.message || e));
 }
 }}
 className="inline-flex items-center justify-center rounded-full border border-amber-400/40 bg-black/30 hover:bg-amber-500/10 text-sm font-medium transition-all px-5 py-2"
 >
 Load latest
 </button>

 <button
 onClick={parseNow}
 className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm hover:bg-slate-800/40 transition"
 >
 Parse JSON
 </button>

 <button
 onClick={() => parsed && verifyAll(parsed)}
 disabled={!parsed}
 className="inline-flex items-center justify-center rounded-full border border-emerald-600/60 bg-emerald-600/10 px-4 py-2 text-sm hover:bg-emerald-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
 >
 Verify
 </button>

 {reportHash && isHex32(reportHash) && (
 <button
 onClick={() => copyAndToast(reportHash)}
 className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm hover:bg-slate-800/40 transition"
 >
 Copy reportHash
 </button>
 )}

 {txHash && (
 <button
 onClick={() => copyAndToast(txHash)}
 className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm hover:bg-slate-800/40 transition"
 >
 Copy tx hash
 </button>
 )}
 </div>

 <div className="mt-4 text-[12px] text-slate-400">
 <div>ProjectKey: <span className="font-mono text-slate-200">{projectKey}</span></div>
 <div>ProjectId: <span className="font-mono text-slate-200">{projectId}</span></div>
 <div>RPC: <span className="font-mono text-slate-200">{rpcUrl ? rpcUrl : "(missing)"}</span></div>
 <div>
 Registry:{" "}
 <span className="font-mono text-slate-200">{registryAddr ? registryAddr : "(missing)"}</span>
 {contractUrl ? (
 <>
 {" · "}
 <a className="text-amber-300 hover:underline" href={contractUrl} target="_blank" rel="noreferrer">
 explorer
 </a>
 </>
 ) : null}
 </div>
 </div>

 <textarea
 value={jsonText}
 onChange={(e) => setJsonText(e.target.value)}
 placeholder="Paste signed daily commit JSON here…"
 className="mt-4 h-80 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-xs text-slate-100 outline-none"
 />

 {err && (
 <div className="mt-4 rounded-xl border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">
 {err}
 </div>
 )}

 {parsed && (
 <div className="mt-6 grid gap-4 md:grid-cols-2">
 <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
 <div className="text-xs uppercase tracking-wide text-slate-400">Signature verification</div>
 <div className="mt-2 text-sm">
 Status:{" "}
 {sigOk === null ? (
 <span className="text-slate-400">not checked</span>
 ) : sigOk ? (
 <span className="text-emerald-300 font-semibold">VALID ✅</span>
 ) : (
 <span className="text-red-300 font-semibold">INVALID ❌</span>
 )}
 </div>

 <div className="mt-2 text-[12px] text-slate-400">
 Validator:{" "}
 <button className="font-mono text-slate-200 hover:underline" onClick={() => parsed?.proofOfValidation?.validatorAddress && copyAndToast(parsed.proofOfValidation.validatorAddress)}>
 {short(parsed?.proofOfValidation?.validatorAddress)}
 </button>
 </div>

 <div className="mt-1 text-[12px] text-slate-400">
 Engine: <span className="font-mono text-slate-200">{parsed?.engine?.engineVersion || "-"}</span>
 </div>

 <div className="mt-1 text-[12px] text-slate-400">
 messageHash:{" "}
 <button className="font-mono text-slate-200 hover:underline" onClick={() => parsed?.proofOfValidation?.messageHash && copyAndToast(parsed.proofOfValidation.messageHash)}>
 {short(parsed?.proofOfValidation?.messageHash)}
 </button>
 </div>
 </div>

 <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
 <div className="text-xs uppercase tracking-wide text-slate-400">On-chain verification</div>
 <div className="mt-2 text-sm">
 Status:{" "}
 {onchainOk === null ? (
 <span className="text-slate-400">not checked</span>
 ) : onchainOk ? (
 <span className="text-emerald-300 font-semibold">FOUND ON-CHAIN ✅</span>
 ) : (
 <span className="text-red-300 font-semibold">NOT FOUND ❌</span>
 )}
 </div>

 <div className="mt-2 text-[12px] text-slate-400">
 reportHash:{" "}
 <button className="font-mono text-slate-200 hover:underline" onClick={() => reportHash && copyAndToast(reportHash)}>
 {short(reportHash)}
 </button>
 </div>

 <div className="mt-1 text-[12px] text-slate-400">
 expectedMsgHash:{" "}
 <button className="font-mono text-slate-200 hover:underline" onClick={() => expectedMsgHash && copyAndToast(expectedMsgHash)}>
 {expectedMsgHash ? short(expectedMsgHash) : "-"}
 </button>
 </div>

 {commitInfo && (
 <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-[12px] text-slate-300">
 <div>
 Recorded block: <span className="font-mono text-slate-100">{commitInfo.blockNumber}</span>
 </div>
 <div>
 Recorded time:{" "}
 <span className="font-mono text-slate-100">
 {commitInfo.ts ? new Date(commitInfo.ts * 1000).toISOString() : "-"}
 </span>
 </div>
 <div>
 Recorded validator:{" "}
 <button className="font-mono text-slate-100 hover:underline" onClick={() => copyAndToast(commitInfo.validator)}>
 {short(commitInfo.validator)}
 </button>
 </div>

 {txHash ? (
 <div className="mt-2">
 Tx:{" "}
 <button className="font-mono text-amber-300 hover:underline" onClick={() => copyAndToast(txHash)}>
 {short(txHash)}
 </button>
 {txUrl ? (
 <>
 {" · "}
 <a className="text-amber-300 hover:underline" href={txUrl} target="_blank" rel="noreferrer">
 explorer
 </a>
 </>
 ) : null}
 </div>
 ) : (
 <div className="mt-2 text-slate-400">Tx: (not resolved via logs)</div>
 )}
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 </main>
 );
}
