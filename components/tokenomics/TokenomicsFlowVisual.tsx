"use client";

function Box({
  children,
  tone = "cyan",
}: {
  children: React.ReactNode;
  tone?: "cyan" | "blue" | "amber";
}) {
  const cls =
    tone === "amber"
      ? "border-amber-400/50 bg-amber-500/15 text-amber-100"
      : tone === "blue"
        ? "border-blue-400/50 bg-blue-500/15 text-blue-100"
        : "border-cyan-400/50 bg-cyan-500/15 text-cyan-100";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-center text-sm font-semibold shadow-[0_0_22px_rgba(34,211,238,0.18)] ${cls}`}>
      {children}
    </div>
  );
}

export default function TokenomicsFlowVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-amber-400/40 bg-[#04091b] p-4 shadow-[0_0_25px_rgba(251,191,36,0.12)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_38%)]" />

      <div className="relative flex min-h-[320px] flex-col justify-center gap-4">
        <div className="text-center text-lg font-bold text-white">
          Tokenomics Flow
        </div>

        <div className="grid grid-cols-3 items-center gap-3">
          <Box tone="blue">Initial Distribution</Box>
          <div className="text-center text-2xl text-cyan-300">→</div>
          <Box tone="cyan">DDC Coin</Box>
        </div>

        <div className="grid grid-cols-3 items-center gap-3">
          <div className="rounded-2xl border border-blue-400/30 bg-blue-950/30 p-3 text-center text-xs text-blue-100">
            Public Presale<br />
            Reward Pool<br />
            Foundation
          </div>

          <div className="flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border-4 border-cyan-400/70 bg-slate-950/70 shadow-[0_0_35px_rgba(34,211,238,0.4)] flex items-center justify-center text-xs font-bold text-cyan-200">
              DDC
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/30 p-3 text-center text-xs text-cyan-100">
            Staking<br />
            Fees<br />
            Governance
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Box tone="cyan">Buyer Allocation<br /><span className="text-xs font-normal">vesting path</span></Box>
          <Box tone="amber">Burn-Locked<br /><span className="text-xs font-normal">non-claimable</span></Box>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-black/40 px-4 py-3 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Effective Circulation
          </div>
          <div className="mt-1 font-mono text-lg text-amber-300">
            S(t) = S₀ − B(t)
          </div>
        </div>
      </div>
    </div>
  );
}
