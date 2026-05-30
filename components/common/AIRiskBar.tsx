"use client";

type Props = {
  score: number;
  risk: string;
};

export default function AIRiskBar({ score, risk }: Props) {
  const pct = Math.max(0, Math.min(100, score));

  const color =
    pct >= 85
      ? "from-red-500 via-red-400 to-red-300"
      : pct >= 65
      ? "from-orange-500 via-amber-400 to-yellow-300"
      : pct >= 40
      ? "from-yellow-500 via-yellow-400 to-lime-300"
      : "from-green-500 via-emerald-400 to-green-300";

  const glow =
    pct >= 85
      ? "shadow-red-500/40"
      : pct >= 65
      ? "shadow-orange-500/40"
      : pct >= 40
      ? "shadow-yellow-500/30"
      : "shadow-green-500/30";

  return (
    <div className="mt-4">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-300">AI Risk Level</span>
        <span
          className={`font-bold ${
            pct >= 85
              ? "text-red-400"
              : pct >= 65
              ? "text-orange-300"
              : pct >= 40
              ? "text-yellow-300"
              : "text-green-300"
          }`}
        >
          {risk} · {pct}%
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} ${glow} transition-all duration-700 ${
            pct >= 85 ? "animate-pulse" : ""
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
