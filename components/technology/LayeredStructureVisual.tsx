"use client";

export default function LayeredStructureVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#04091b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_62%)]" />

      <div className="relative flex h-full flex-col items-center justify-center gap-2 px-4">
        <div className="w-[82%] rounded-lg border border-blue-400/60 bg-blue-950/45 px-4 py-2 text-center text-sm font-semibold text-white shadow-[0_0_22px_rgba(59,130,246,0.45)]">
          Application Layer
        </div>

        <div className="text-amber-300 text-xl">↑</div>

        <div className="w-[82%] rounded-lg border border-amber-300/80 bg-gradient-to-r from-amber-500 to-yellow-300 px-4 py-2 text-center text-sm font-semibold text-black shadow-[0_0_28px_rgba(251,191,36,0.55)]">
          AI Coordination Layer
        </div>

        <div className="text-amber-300 text-xl">↑</div>

        <div className="w-[82%] rounded-lg border border-blue-400/60 bg-blue-950/45 px-4 py-2 text-center text-sm font-semibold text-white shadow-[0_0_22px_rgba(59,130,246,0.45)]">
          Base (Diamond-DAG) Layer
        </div>

        <div className="mt-2 text-[11px] text-slate-200">
          DDC Layered Architecture
        </div>
      </div>
    </div>
  );
}
