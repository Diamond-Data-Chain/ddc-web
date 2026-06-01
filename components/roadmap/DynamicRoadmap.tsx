"use client";

import { ROADMAP_FEATURES, ROADMAP_PHASES, type RoadmapStatus } from "@/data/roadmapPhases";

const statusLabel: Record<RoadmapStatus, string> = {
  completed: "COMPLETED",
  active: "IN PROGRESS",
  upcoming: "UPCOMING",
  milestone: "MILESTONE",
  future: "FUTURE",
};

const colorClasses: Record<string, string> = {
  cyan: "border-cyan-400/60 shadow-cyan-500/20 text-cyan-200 from-cyan-500/20",
  green: "border-green-400/60 shadow-green-500/20 text-green-200 from-green-500/20",
  yellow: "border-yellow-400/60 shadow-yellow-500/20 text-yellow-200 from-yellow-500/20",
  purple: "border-purple-400/60 shadow-purple-500/20 text-purple-200 from-purple-500/20",
  blue: "border-sky-400/60 shadow-sky-500/20 text-sky-200 from-sky-500/20",
  orange: "border-orange-400/60 shadow-orange-500/20 text-orange-200 from-orange-500/20",
  teal: "border-teal-400/60 shadow-teal-500/20 text-teal-200 from-teal-500/20",
};

export default function DynamicRoadmap() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950 px-4 py-10 shadow-[0_0_50px_rgba(34,211,238,0.15)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_35%),radial-gradient(circle_at_bottom,rgba(251,191,36,0.10),transparent_35%)]" />

      <div className="relative">
        <div className="mb-10 text-center">
          <h3 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              DDChain
            </span>
          </h3>
          <div className="mt-2 text-2xl md:text-4xl tracking-[0.35em] text-slate-200">
            ROADMAP
          </div>
          <p className="mt-4 text-cyan-200">
            Transparent. On-Chain. AI-Powered.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
          {ROADMAP_PHASES.map((phase) => {
            const c = colorClasses[phase.color];

            return (
              <div
                key={phase.quarter}
                className={`relative flex min-h-[520px] flex-col rounded-2xl border bg-gradient-to-b ${c} to-slate-950/70 p-5 shadow-2xl backdrop-blur transition hover:-translate-y-1`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">{phase.quarter}</div>
                  <div className="mt-3 min-h-[64px] text-sm font-bold uppercase leading-snug text-white">
                    {phase.title}
                  </div>
                </div>

                <div className="my-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-current bg-black/30 text-4xl shadow-[0_0_30px_currentColor]">
                    {phase.icon}
                  </div>
                </div>

                <ul className="flex-1 space-y-3 text-sm text-slate-100">
                  {phase.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-0.5 text-current">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-xl border border-current/50 bg-black/30 px-3 py-2 text-center text-sm font-bold">
                  {statusLabel[phase.status]}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-cyan-400/40 bg-black/50 px-5 py-4 text-center shadow-[0_0_30px_rgba(34,211,238,0.18)]">
          <div className="text-sm font-bold text-lime-300">
            ⏳ PRESALE DURATION: MAX 4096 HOURS (40 BATCHES × 102.4 HOURS) ≈ 5.6 MONTHS
          </div>
          <div className="mt-1 text-xs text-cyan-100">
            Public, permissionless, on-chain. No whitelist. No KYC. No geo-restrictions.
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {ROADMAP_FEATURES.map((feature) => (
            <div
              key={feature}
              className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-4 text-center text-xs font-semibold uppercase tracking-wide text-cyan-100"
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
