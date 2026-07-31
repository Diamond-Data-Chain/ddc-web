'use client';

import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

const VAULT_ABI = [
 // legacy config (already in your UI)
 'function getProjectConfig() view returns (bytes32 projectId,address ddcToken,address assetUSDT,address governor,address daoExecutor,bool daoMode,uint64 commitFreq,bool requireDDCLogPerTransfer)',
 'function getTotalInflowTracked() view returns (uint256)',
 'function getAllocationRule(uint8 role) view returns (uint256 maxBps,uint256 maxAbsolute,bool enabled)',
 'function getSpent(uint8 role) view returns (uint256)',
 'function remainingAllocation(uint8 role) view returns (uint256)',
 'function listWalletsByRole(uint8 role) view returns (address[])',

];


const ERC20_ABI = [
 'function balanceOf(address) view returns (uint256)',
];

// Roles enum order must match contract
const ROLES: { id: number; name: string }[] = [
 { id: 1, name: 'DEV' },
 { id: 2, name: 'MARKETING' },
 { id: 3, name: 'LIQUIDITY' },
 { id: 4, name: 'OPERATIONS' },
 { id: 5, name: 'PAYROLL' },
 { id: 6, name: 'FOUNDER' },
 { id: 7, name: 'CEX' },
 { id: 8, name: 'OTHER' },
];

function short(a?: string) {
 if (!a) return '-';
 return a.slice(0, 6) + '…' + a.slice(-4);
}

export default function TreasuryPage() {
 const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || '';
 const vaultAddr = process.env.NEXT_PUBLIC_TREASURY_VAULT_ADDRESS || '';

 const presaleAddr = process.env.NEXT_PUBLIC_PRESALE_ADDRESS || '';
 const ddcAddr = process.env.NEXT_PUBLIC_DDC_TOKEN_ADDRESS || '';
 const usdtAddr = process.env.NEXT_PUBLIC_USDT_ADDRESS || '';
 const recorderAddr = process.env.NEXT_PUBLIC_RECORDER_ADDRESS || '';
 const rewardPoolAddr = process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS || '';
 const treasuryAddr = process.env.NEXT_PUBLIC_TREASURY_ADDRESS || '';
 const teamVaultAddr = process.env.NEXT_PUBLIC_TEAM_VAULT_ADDRESS || '';
 const advisorsVaultAddr = process.env.NEXT_PUBLIC_ADVISORS_VAULT_ADDRESS || '';
 const monthlyOpsAddr = process.env.NEXT_PUBLIC_MONTHLY_OPS_VAULT_ADDRESS || '';
 const adamasGrantAddr = process.env.NEXT_PUBLIC_ADAMAS_GRANT_VAULT_ADDRESS || '';
 const marketingAddr = process.env.NEXT_PUBLIC_MARKETING_WALLET_ADDRESS || '';

 const provider = useMemo(() => {
 if (!rpcUrl) return null;
 try {
 return new ethers.JsonRpcProvider(rpcUrl, undefined, { batchMaxCount: 1, batchStallTime: 0 });
 } catch {
 return null;
 }
 }, [rpcUrl]);

 const [loading, setLoading] = useState(false);
 const [err, setErr] = useState<string | null>(null);

 // legacy config shown in UI
 const [cfg, setCfg] = useState<any>(null);
 const [inflow, setInflow] = useState<bigint>(0n);

 // roles
 const [roleRows, setRoleRows] = useState<Record<number, any>>({});
 const [walletBalances, setWalletBalances] = useState<Record<string, bigint>>({});

 async function load() {
 setErr(null);
 setLoading(true);
 try {
 if (!provider) throw new Error('NEXT_PUBLIC_RPC_URL is missing');

 // Load public wallet DDC balances first. This must not depend on legacy vault reads.
 try {
 const ddcForBalance = process.env.NEXT_PUBLIC_DDC_TOKEN_ADDRESS || '';
 if (ddcForBalance) {
 const ddc = new ethers.Contract(ddcForBalance, ERC20_ABI, provider);
 const rows = [
 treasuryAddr || vaultAddr,
 marketingAddr,
 monthlyOpsAddr,
 adamasGrantAddr,
 teamVaultAddr,
 advisorsVaultAddr,
 rewardPoolAddr,
 presaleAddr,
 ];
 const balances: Record<string, bigint> = {};
 for (const addr of rows) {
 if (!addr) continue;
 try {
 const bal = await ddc.balanceOf(addr);
 balances[addr.toLowerCase()] = BigInt(bal.toString());
 } catch {}
 }
 setWalletBalances(balances);
 }
 } catch {}

 const vault = vaultAddr ? ethers.getAddress(vaultAddr) : '';

 let v: ethers.Contract | null = null;
 if (vault) {
 const code = await provider.getCode(vault);
 if (code !== '0x') {
 v = new ethers.Contract(vault, VAULT_ABI, provider);
 }
 }

 // config
 try {
 if (!v) throw new Error("no treasury policy vault");
 const pc = await v.getProjectConfig();
 setCfg(pc);
 } catch (e: any) {
 setCfg(null);
 }

 // inflow
 try {
 if (!v) throw new Error("no treasury policy vault");
 const total = await v.getTotalInflowTracked();
 setInflow(BigInt(total.toString()));
 } catch {
 setInflow(0n);
 }

 // roles
 const next: Record<number, any> = {};
 for (const r of ROLES) {
 let rule = { enabled: false, maxBps: 0n, maxAbsolute: 0n };
 let spent = 0n;
 let remaining: bigint | null = null;
 let wallets: string[] = [];

 try {
 if (!v) throw new Error("no treasury policy vault");
 const rr = await v.getAllocationRule(r.id);
 rule = { enabled: Boolean(rr[2]), maxBps: BigInt(rr[0].toString()), maxAbsolute: BigInt(rr[1].toString()) };
 } catch {}

 try {
 if (!v) throw new Error("no treasury policy vault");
 const s = await v.getSpent(r.id);
 spent = BigInt(s.toString());
 } catch {}

 try {
 if (!v) throw new Error("no treasury policy vault");
 const rem = await v.remainingAllocation(r.id);
 remaining = BigInt(rem.toString());
 } catch {
 remaining = null;
 }

 try {
 if (!v) throw new Error("no treasury policy vault");
 wallets = await v.listWalletsByRole(r.id);
 } catch {
 wallets = [];
 }

 next[r.id] = { rule, spent, remaining, wallets };
 }
 setRoleRows(next);

 } catch (e: any) {
 setErr(String(e?.shortMessage || e?.message || e));
 } finally {
 setLoading(false);
 }
 }

 useEffect(() => {
 load().catch(() => {});
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [rpcUrl, vaultAddr]);

 const fmtUSDT = (x: bigint) => {
 try { return Number(ethers.formatUnits(x, 6)).toLocaleString('en-US', { maximumFractionDigits: 6 }); }
 catch { return '0'; }
 };

 const walletRows = [
   { label: 'Treasury Safe', type: 'Multisig treasury / ownership control', address: treasuryAddr || vaultAddr, showBalance: true },
   { label: 'Marketing Wallet', type: 'Marketing operations wallet', address: marketingAddr, showBalance: true },
   { label: 'Monthly Operations Vault', type: 'Monthly operational reserve', address: monthlyOpsAddr, showBalance: true },
   { label: 'Adamas Grant Vault', type: 'Adamas ecosystem / grant reserve', address: adamasGrantAddr, showBalance: true },
   { label: 'Team Vesting Vault', type: 'Independent team vesting vault', address: teamVaultAddr, showBalance: true },
   { label: 'Advisors Vesting Vault', type: 'Advisors vesting vault', address: advisorsVaultAddr, showBalance: true },
   { label: 'Reward Pool', type: 'Reward and burn-lock accounting pool', address: rewardPoolAddr, showBalance: true },
   { label: 'Presale Contract Reserve', type: 'Public presale contract', address: presaleAddr, showBalance: true },
   { label: 'DDC Coin Contract', type: 'DDC coin asset contract', address: ddcAddr, showBalance: false },
   { label: 'Recorder', type: 'DDC token / record registry', address: recorderAddr, showBalance: false },
   { label: 'USDT Asset', type: 'BEP-20 USDT payment asset', address: usdtAddr, showBalance: false },
 ];

 return (
 <main className="min-h-screen bg-black text-amber-50">
 <div className="mx-auto max-w-6xl px-6 py-10">
 <h1 className="text-2xl font-semibold text-amber-200">Treasury Wallet Registry</h1>
 <p className="mt-2 text-amber-100/80">
 Public on-chain registry of configured DDChain wallets, vaults, and contracts.
 </p>

 {/* WALLET REGISTRY */}
 <div className="mt-6 rounded-2xl border border-amber-500/30 bg-black/35 p-5">
 <div className="text-sm font-semibold text-amber-200">Treasury Wallet Registry</div>
 <div className="mt-1 text-[12px] text-amber-100/70">
 Public operational wallet map. Only real configured wallets/contracts are shown.
 </div>

 <div className="mt-4 grid gap-4">
 {walletRows.map((w) => (
 <div key={w.label} className="rounded-2xl border border-amber-500/30 bg-black/30 p-4">
 <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
 <div>
 <div className="text-sm font-semibold text-amber-200">{w.label}</div>
 <div className="mt-1 text-xs text-amber-100/65">{w.type}</div>
 </div>
 <div className="text-right">
 <div className="text-sm text-amber-200 font-mono break-all">
 {w.address || '—'}
 </div>
 {w.showBalance && w.address && (
 <div className="mt-2 text-xs text-emerald-300 font-mono">
 Balance: {walletBalances[w.address.toLowerCase()] == null ? '—' : `${Number(ethers.formatEther(walletBalances[w.address.toLowerCase()])).toLocaleString('en-US', { maximumFractionDigits: 6 })} DDC`}
 </div>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>
 </main>
 );
}
