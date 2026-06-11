"use client";

function NodeBox({
  className,
  title,
  tone,
}: {
  className: string;
  title: string;
  tone: "blue" | "teal";
}) {
  const cls =
    tone === "teal"
      ? "border-teal-300/70 bg-teal-950/45 text-teal-50 shadow-[0_0_24px_rgba(45,212,191,0.38)]"
      : "border-sky-300/70 bg-blue-950/45 text-sky-50 shadow-[0_0_24px_rgba(56,189,248,0.38)]";

  return (
    <div
      className={`absolute flex h-14 w-36 items-center justify-center rounded-xl border px-3 text-center text-xs font-bold ${cls} ${className}`}
    >
      {title}
    </div>
  );
}

export default function AIDataFeedbackVisual() {
  return (
    <div className="relative h-full min-h-[250px] w-full overflow-hidden rounded-xl bg-[#04091b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.28),transparent_42%),radial-gradient(circle_at_center,rgba(132,204,22,0.14),transparent_68%)]" />

      <div className="relative flex h-full flex-col items-center justify-center px-3 py-4">
        <div className="mb-1 text-center text-xl font-black text-white">
          AI Data Feedback Cycle
        </div>

        <div className="relative h-[190px] w-full max-w-[520px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 190" fill="none">
            <defs>
              <filter id="cycleGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="cycleGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="55%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#bef264" />
              </linearGradient>
            </defs>

            <path
              d="M115 48 C170 2, 350 2, 405 48"
              stroke="url(#cycleGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#cycleGlow)"
            />
            <path
              d="M393 34 L423 50 L395 66"
              stroke="#bef264"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#cycleGlow)"
            />

            <path
              d="M405 142 C340 190, 175 190, 115 142"
              stroke="url(#cycleGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#cycleGlow)"
            />
            <path
              d="M128 158 L98 142 L126 126"
              stroke="#38bdf8"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#cycleGlow)"
            />

            <path d="M145 92 L220 92" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" filter="url(#cycleGlow)" />
            <path d="M205 78 L225 92 L205 106" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#cycleGlow)" />

            <path d="M300 92 L375 92" stroke="#bef264" strokeWidth="5" strokeLinecap="round" filter="url(#cycleGlow)" />
            <path d="M360 78 L380 92 L360 106" stroke="#bef264" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#cycleGlow)" />

            <path d="M370 136 L300 136" stroke="#67e8f9" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            <path d="M318 124 L298 136 L318 148" stroke="#67e8f9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
          </svg>

          <NodeBox title="Data Input" tone="blue" className="left-0 top-[66px]" />
          <NodeBox title="Parameter Adjustment" tone="teal" className="right-0 top-[66px]" />
          <NodeBox title="AI Model" tone="blue" className="left-[58px] bottom-[6px]" />
          <NodeBox title="Consensus Update" tone="teal" className="right-[46px] bottom-[6px]" />

          <div className="absolute left-1/2 top-[52px] flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-3xl border border-cyan-300/80 bg-cyan-950/50 text-center shadow-[0_0_45px_rgba(34,211,238,0.65)]">
            <div>
              <div className="text-xl font-black text-cyan-100">AI</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Core
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
