"use client";

type Props = {
  score: number;
  risk: string;
};

function riskLabel(score: number) {
  if (score >= 85) return "CRITICAL";
  if (score >= 65) return "SUSPICIOUS";
  if (score >= 40) return "WARNING";
  return "NORMAL";
}

function markerColor(score: number) {
  if (score >= 85) return "bg-red-400 shadow-red-500/70";
  if (score >= 65) return "bg-orange-300 shadow-orange-500/60";
  if (score >= 40) return "bg-yellow-300 shadow-yellow-500/50";
  return "bg-green-300 shadow-green-500/50";
}

export default function AIRiskBar({ score, risk }: Props) {
  const pct = Math.max(0, Math.min(100, score));
  const label = riskLabel(pct);

  return (
    <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500">
            AI Anomaly Spectrum
          </div>
          <div className="text-sm text-slate-300">
            Green → Yellow → Orange → Red
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-white">
            {score}/100
          </div>
          <div className="text-xs font-semibold text-slate-400">
            {risk} · {label}
          </div>
        </div>
      </div>

      <div className="relative h-5">
        <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-gradient-to-r from-green-400 via-yellow-300 via-orange-400 to-red-500" />

        <div
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-white shadow-lg ${markerColor(pct)}`}
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>

      <div className="mt-3 flex justify-between text-[11px] text-slate-400">
        <span>Normal</span>
        <span>Warning</span>
        <span>Suspicious</span>
        <span>Critical</span>
      </div>
    </div>
  );
}
