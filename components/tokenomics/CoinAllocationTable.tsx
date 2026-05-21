"use client";

import Link from "next/link";

type Row = {
 category: string;
 percent: string;
 coins: string;
 treatment: string;
 href: string;
 cta: string;
};

const ROWS: Row[] = [
 {
 category: "Public Presale",
 percent: "40%",
 coins: "102.4M",
 treatment:
 "Buyer portion (50%): 10% at TGE, remainder vested. Remaining portion (50%) permanently burn-locked (non-claimable).",
 href: "/public-ddc-token",
 cta: "Public DDC Token",
 },
 {
 category: "Reward Pool",
 percent: "20%",
 coins: "51.2M",
 treatment:
 "Accounting pool: burn-locked + reward-eligible DDC. Burn-locked excluded from vesting/claiming/validator incentives.",
 href: "/reward-pool-ddc-token",
 cta: "Reward Pool DDC Token",
 },
 {
 category: "Foundation",
 percent: "15%",
 coins: "38.4M",
 treatment:
 "Continuous allocation subject exclusively to governance-approved rules and on-chain constraints (no discretionary adjustment).",
 href: "/foundation-ddc-token",
 cta: "Foundation DDC Token",
 },
 {
 category: "Treasury",
 percent: "7.5%",
 coins: "19.2M",
 treatment: "18-month linear unlock.",
 href: "/treasury",
 cta: "Treasury DDC Token",
 },
 {
 category: "Team",
 percent: "12.5%",
 coins: "32.0M",
 treatment: "24-month linear vesting, no TGE unlock.",
 href: "/team-ddc-token",
 cta: "Team DDC Token",
 },
 {
 category: "Advisors",
 percent: "5%",
 coins: "12.8M",
 treatment: "Dedicated vesting schedule (see vesting section).",
 href: "/advisors-ddc-token",
 cta: "Advisors DDC Token",
 },
];

export default function CoinAllocationTable() {
 return (
 <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div>
 <h3 className="font-semibold">Coin Allocation Table</h3>
 <p className="text-sm text-slate-400">
 
 </p>
 </div>
 </div>

 <div className="mt-4 overflow-x-auto">
 <table className="w-full table-fixed text-left text-sm">
 <colgroup>
 <col className="w-44" />
 <col className="w-16" />
 <col className="w-24" />
 <col />
 <col className="w-56" />
 </colgroup>

 <thead className="text-xs text-slate-400">
 <tr className="border-b border-slate-800">
 <th className="py-2 pr-3">Category</th>
 <th className="py-2 pr-3">%</th>
 <th className="py-2 pr-3">Coins</th>
 <th className="py-2 pr-3">Vesting / Treatment</th>
 <th className="py-2 pr-3">DDC Token</th>
 </tr>
 </thead>

 <tbody className="text-slate-300">
 {ROWS.map((r, idx) => (
 <tr
 key={r.category}
 className={[
 "border-t border-slate-800 align-top",
 idx % 2 === 0 ? "bg-slate-950/10" : "bg-transparent",
 ].join(" ")}
 >
 <td className="py-3 pr-3 font-semibold text-slate-300">{r.category}</td>
 <td className="py-3 pr-3 font-mono">{r.percent}</td>
 <td className="py-3 pr-3 font-mono">{r.coins}</td>
 <td className="py-3 pr-3 text-slate-400">{r.treatment}</td>
 <td className="py-3 pr-3">
 <Link
 href={r.href}
 className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm hover:bg-slate-800/40 transition"
 >
 {r.cta}
 </Link>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 <div className="mt-3 text-xs text-slate-500">Total Maximum Supply: 256,000,000 DDC</div>
 </div>
 );
}
