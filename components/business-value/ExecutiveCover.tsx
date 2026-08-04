type Props = {
  assessmentId: string;
  company: string;
  industry: string;
  generatedDate: string;
};

export default function ExecutiveCover({
  assessmentId,
  company,
  industry,
  generatedDate,
}: Props) {
  return (
    <section className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-[#0b0b0b] via-[#141414] to-[#1b1b1b] p-8 shadow-[0_0_40px_rgba(251,191,36,.15)]">

      <p className="text-sm uppercase tracking-[0.35em] text-amber-400">
        Diamond Data Chain
      </p>

      <h1 className="mt-3 text-4xl font-bold text-white">
        DDC Business Value Assessment
      </h1>

      <p className="mt-3 max-w-3xl text-slate-300 leading-7">
        Executive business assessment prepared to estimate the operational and
        financial impact of fragmented evidence and the potential business value
        of verifiable DDC Token records.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">

        <div className="rounded-2xl border border-amber-400/30 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Prepared for
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            {company || "Unnamed organization"}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-400/30 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Industry
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            {industry}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-400/30 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Assessment ID
          </p>

          <p className="mt-2 font-mono text-xl font-semibold text-amber-300">
            {assessmentId}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-400/30 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Assessment Date
          </p>

          <p className="mt-2 text-xl font-semibold text-white">
            {generatedDate}
          </p>
        </div>

      </div>
    </section>
  );
}
