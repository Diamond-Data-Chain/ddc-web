"use client";

export default function NumberField({
  label,
  helper,
  value,
  suffix,
  step = 1,
  onChange,
}: {
  label: string;
  helper: string;
  value: number;
  suffix?: string;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-100">
        {label}
      </span>

      <span className="mt-1 block min-h-[44px] text-sm leading-6 text-slate-400">
        {helper}
      </span>

      <div className="mt-3 flex overflow-hidden rounded-xl border border-slate-700 bg-slate-950/80 transition focus-within:border-amber-400/70">
        <input
          type="number"
          min={0}
          step={step}
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(Number.isFinite(next) ? Math.max(0, next) : 0);
          }}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-white outline-none"
        />

        {suffix && (
          <span className="flex items-center border-l border-slate-700 px-3 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}
