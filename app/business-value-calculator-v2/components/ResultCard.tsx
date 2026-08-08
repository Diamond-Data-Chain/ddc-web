"use client";

export default function ResultCard({
  index,
  title,
  value,
  highlighted = false,
}: {
  index: number;
  title: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={
        highlighted
          ? "relative overflow-hidden rounded-[24px] border border-amber-400/55 bg-slate-900/80 p-6 shadow-[0_0_40px_rgba(251,191,36,0.12)]"
          : "relative overflow-hidden rounded-[24px] border border-amber-500/30 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-amber-300/65 hover:shadow-[0_18px_60px_rgba(251,191,36,0.10)]"
      }
    >
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300/80">
        {String(index).padStart(2, "0")}
      </div>

      <div className="mt-4 text-sm font-medium leading-6 text-slate-300">
        {title}
      </div>

      <div
        className={
          highlighted
            ? "mt-3 text-3xl font-semibold text-amber-200"
            : "mt-3 text-3xl font-semibold text-white"
        }
      >
        {value}
      </div>
    </div>
  );
}
