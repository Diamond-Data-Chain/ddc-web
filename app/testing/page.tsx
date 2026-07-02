const docs = [
  {
    title: "Testing Overview",
    desc: "General testing documentation and verification structure.",
    href: "/docs/testing/README.md",
  },
  {
    title: "Final Test Report",
    desc: "Final presale test report and operational verification summary.",
    href: "/docs/testing/FINAL_TEST_REPORT.md",
  },
  {
    title: "Final Summary",
    desc: "Condensed summary of completed testing and launch readiness.",
    href: "/docs/testing/FINAL_SUMMARY.md",
  },
  {
    title: "Test Matrix",
    desc: "Structured list of test categories, flows, and expected behavior.",
    href: "/docs/testing/TEST_MATRIX.md",
  },
  {
    title: "Evidence Index",
    desc: "Index of test evidence, records, and verification references.",
    href: "/docs/testing/EVIDENCE_INDEX.md",
  },
  {
    title: "Known Limitations",
    desc: "Known limitations and disclosure notes for public review.",
    href: "/docs/testing/KNOWN_LIMITATIONS.md",
  },
];

export default function TestingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-20 text-slate-50">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
          DDC Public Verification
        </div>

        <h1 className="mt-4 text-4xl font-black md:text-6xl">
          Testing Center
        </h1>

        <p className="mt-5 max-w-3xl text-slate-300">
          Public testing documentation for Diamond Data Chain v1, including
          presale flow verification, batch transition checks, evidence records,
          known limitations, and operational readiness documentation.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {docs.map((doc) => (
            <a
              key={doc.href}
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-3xl border border-amber-400/30 bg-slate-900/50 p-6 shadow-[0_0_30px_rgba(251,191,36,0.08)] transition hover:-translate-y-1 hover:border-amber-400/70 hover:shadow-[0_0_35px_rgba(251,191,36,0.18)]"
            >
              <h2 className="text-xl font-bold text-amber-200">
                {doc.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {doc.desc}
              </p>
              <div className="mt-5 text-sm font-semibold text-amber-300">
                Open document →
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-emerald-400/40 bg-emerald-950/20 p-6 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">
            Status
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-200">
            PUBLIC TESTING EVIDENCE AVAILABLE
          </div>
        </div>
      </div>
    </main>
  );
}
