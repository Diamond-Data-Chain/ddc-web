"use client";

const data = [
  { label: "Public Presale", value: 40, color: "#2447ff" },
  { label: "Reward Pool", value: 20, color: "#c53a3a" },
  { label: "Foundation", value: 15, color: "#95c84b" },
  { label: "Team", value: 12.5, color: "#b9c8ff" },
  { label: "Treasury", value: 7.5, color: "#9fe6ff" },
  { label: "Advisors", value: 5, color: "#f0a02d" },
];

function donutSegments() {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return data.map((item) => {
    const length = (item.value / 100) * circumference;

    const seg = {
      ...item,
      dasharray: `${length} ${circumference}`,
      dashoffset: -offset,
    };

    offset += length;

    return seg;
  });
}

export default function TokenDistributionVisual() {
  const segments = donutSegments();

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#04091b]">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(80,120,255,0.25),transparent_60%)]" />

      <div className="relative flex h-full flex-col items-center justify-center gap-4 lg:flex-row">

        {/* DONUT */}
        <div className="flex items-center justify-center">

          <svg
            viewBox="0 0 260 260"
            className="h-[200px] w-[200px] drop-shadow-[0_0_35px_rgba(80,120,255,0.4)]"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx="130"
              cy="130"
              r="88"
              fill="none"
              stroke="#0f172a"
              strokeWidth="42"
            />

            {segments.map((s) => (
              <circle
                key={s.label}
                cx="130"
                cy="130"
                r="88"
                fill="none"
                stroke={s.color}
                strokeWidth="42"
                strokeDasharray={s.dasharray}
                strokeDashoffset={s.dashoffset}
                strokeLinecap="butt"
                transform="rotate(-90 130 130)"
                filter="url(#glow)"
              />
            ))}

            <circle
              cx="130"
              cy="130"
              r="48"
              fill="#050816"
            />

            <text
              x="130"
              y="122"
              textAnchor="middle"
              className="fill-white text-[10px]"
            >
              DDC
            </text>

            <text
              x="130"
              y="142"
              textAnchor="middle"
              className="fill-cyan-300 text-[8px]"
            >
              256M COINS
            </text>
          </svg>
        </div>

        {/* LEGENDA */}
        <div className="w-full max-w-[260px] py-2 space-y-1.5">

          <div className="mb-2 text-center text-lg font-bold text-white lg:text-left">
            Coin Distribution
          </div>

          {data.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg bg-slate-900/40 px-3 py-1.5"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-slate-100">
                  {item.label}
                </span>
              </div>

              <span className="text-xs font-semibold text-white">
                {item.value}%
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
