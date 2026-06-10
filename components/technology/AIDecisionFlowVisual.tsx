"use client";

export default function AIDecisionFlowVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#04091b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.28),transparent_65%)]" />

      <div className="relative flex h-full flex-col items-center justify-center px-3 py-4">
        <div className="mb-4 text-center text-xl font-bold tracking-wide text-white">
          AI DECISION FLOW
        </div>

        <div className="flex w-full items-center justify-center gap-2">
          <div className="flex h-16 w-32 items-center justify-center rounded-lg border border-blue-500/50 bg-blue-950/40 text-center text-sm font-semibold text-amber-300 shadow-[0_0_18px_rgba(59,130,246,0.4)]">
            NETWORK<br/>DATA
          </div>

          <div className="text-3xl font-bold text-amber-300">→</div>

          <div className="flex h-16 w-40 items-center justify-center rounded-lg border border-slate-300 bg-white text-center text-sm font-bold text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            OPTIMIZATION<br/>PROPOSAL
          </div>

          <div className="text-3xl font-bold text-amber-300">→</div>

          <div className="flex h-16 w-32 items-center justify-center rounded-lg border border-blue-500/50 bg-blue-950/40 text-center text-sm font-semibold text-amber-300 shadow-[0_0_18px_rgba(59,130,246,0.4)]">
            SIMULATION
          </div>
        </div>

        <div className="mt-2 grid w-full grid-cols-[1fr_32px_1fr_32px_1fr]">
          <div />
          <div />
          <div />
          <div />
          <div className="text-center text-3xl font-bold text-amber-300">↓</div>
        </div>

        <div className="grid w-full grid-cols-[1fr_32px_1fr_32px_1fr]">
          <div />
          <div />
          <div />
          <div />
          <div className="flex h-16 w-32 items-center justify-center rounded-lg border border-blue-500/50 bg-blue-950/40 text-center text-sm font-semibold text-amber-300 shadow-[0_0_18px_rgba(59,130,246,0.4)]">
            ON-CHAIN<br/>EXECUTION
          </div>
        </div>
      </div>
    </div>
  );
}
