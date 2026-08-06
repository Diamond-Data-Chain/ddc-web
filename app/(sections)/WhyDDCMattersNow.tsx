"use client";

import { useEffect, useRef } from "react";

const cards = [
  {
    badge: "AI",
    title: "AI is becoming part of critical decisions",
    text:
      "Artificial intelligence is moving beyond chatbots into finance, healthcare, manufacturing, energy, logistics and public services. As AI becomes part of high-impact decisions, organizations will need verifiable evidence of how those decisions were made.",
    visual: "ai",
  },
  {
    badge: "Governance",
    title: "Accountability is becoming a business requirement",
    text:
      "Future regulations, enterprise governance and internal audits will increasingly require organizations to prove what information existed, who approved decisions and which governance rules applied at that moment.",
    visual: "timeline",
  },
  {
    badge: "Verification",
    title: "Trust requires verifiable infrastructure",
    text:
      "Organizations replace software, merge with other organizations, migrate infrastructure and change governance platforms. Diamond Data Chain preserves governance history independently of those operational changes.",
    visual: "comparison",
  },
  {
    badge: "Infrastructure",
    title: "Infrastructure for the next generation of trusted systems",
    text:
      "Diamond Data Chain combines transparent governance, deterministic allocation, verifiable records and future AI-assisted accountability into infrastructure designed for the next generation of digital systems.",
    visual: "network",
  },
  {
    badge: "Positioning",
    title: "Where DDC Fits",
    text:
      "DDC sits between operational systems and the independent governance history required for audits, investigations, regulators and courts.",
    visual: "fit",
  },
];

function AIControlRoomVisual() {
  return (
    <div className="relative flex min-h-[290px] items-center justify-center overflow-hidden rounded-2xl border border-amber-500/25 bg-slate-950/90 p-5">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative w-full max-w-[560px] rounded-xl border border-cyan-400/30 bg-slate-900/95 p-5 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
        <div className="mb-5 flex items-center justify-between border-b border-slate-700 pb-3">
          <span className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Decision Control
          </span>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
            Pending
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
              AI Recommendation
            </div>
            <div className="mt-1 text-xl font-semibold text-slate-100">
              Proceed with controlled deployment
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-amber-500/20 bg-slate-950/80 p-4">
              <div className="text-xs text-slate-500">Confidence</div>
              <div className="mt-1 text-2xl font-semibold text-cyan-300">94%</div>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-slate-950/80 p-4">
              <div className="text-xs text-slate-500">Status</div>
              <div className="mt-1 text-sm font-medium text-amber-300">
                Awaiting Human Approval
              </div>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-cyan-500/70 to-cyan-300" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-end gap-3 opacity-80">
        <div className="h-10 w-5 rounded-t-full bg-slate-700" />
        <div className="h-12 w-6 rounded-t-full bg-slate-600" />
        <div className="h-9 w-5 rounded-t-full bg-slate-700" />
      </div>
    </div>
  );
}

function TimelineVisual() {
  const steps = [
    "AI Recommendation",
    "Human Review",
    "Approval",
    "Governance Policy",
    "Permanent Record",
  ];

  return (
    <div className="relative flex min-h-[290px] items-center justify-center overflow-hidden rounded-2xl border border-amber-500/25 bg-slate-950/90 p-6">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,transparent,rgba(148,163,184,0.07),transparent)]" />

      <div className="relative w-full max-w-[500px] rounded-xl border border-amber-500/25 bg-slate-900/90 px-6 py-5">
        <div className="mb-5 border-b border-slate-700 pb-3 text-xs uppercase tracking-[0.28em] text-slate-400">
          Decision Governance Timeline
        </div>

        <div className="space-y-0">
          {steps.map((step, index) => (
            <div key={step} className="relative flex items-center gap-4">
              <div className="relative flex flex-col items-center">
                <div className="z-10 h-3 w-3 rounded-full border border-cyan-300 bg-slate-950 shadow-[0_0_14px_rgba(103,232,249,0.4)]" />
                {index !== steps.length - 1 && (
                  <div className="h-8 w-px bg-gradient-to-b from-cyan-300/50 to-slate-700" />
                )}
              </div>

              <div
                className={`min-w-0 flex-1 rounded-lg border px-4 py-2.5 ${
                  index === steps.length - 1
                    ? "border-emerald-400/30 bg-emerald-400/5"
                    : "border-slate-700 bg-slate-950/70"
                }`}
              >
                <span className="text-sm font-medium text-slate-200">{step}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonVisual() {
  return (
    <div className="grid min-h-[290px] grid-cols-1 overflow-hidden rounded-2xl border border-amber-500/25 bg-slate-950/90 md:grid-cols-2">
      <div className="border-b border-slate-700/70 p-6 md:border-b-0 md:border-r">
        <div className="mb-5 text-xs uppercase tracking-[0.25em] text-slate-500">
          Ordinary Database
        </div>

        <div className="space-y-3">
          {["Delete", "Modify", "Overwrite", "History Changed"].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-lg border border-red-400/15 bg-red-400/5 px-4 py-3"
            >
              <span className="text-sm text-slate-300">{item}</span>
              <span className="text-red-300">×</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-5 text-xs uppercase tracking-[0.25em] text-cyan-300">
          DDC
        </div>

        <div className="space-y-3">
          {["Immutable", "Timestamped", "Verified", "Auditable"].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-lg border border-cyan-300/20 bg-cyan-300/5 px-4 py-3"
            >
              <span className="text-sm text-slate-200">{item}</span>
              <span className="text-cyan-300">✓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NetworkVisual() {
  const nodes = [
    { label: "Energy", position: "left-[8%] top-[12%]" },
    { label: "Healthcare", position: "right-[7%] top-[12%]" },
    { label: "Finance", position: "left-[2%] top-[46%]" },
    { label: "Manufacturing", position: "right-[1%] top-[46%]" },
    { label: "Supply Chain", position: "left-[10%] bottom-[10%]" },
    { label: "Government", position: "right-[8%] bottom-[10%]" },
  ];

  return (
    <div className="relative min-h-[290px] overflow-hidden rounded-2xl border border-amber-500/25 bg-slate-950/90">
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_45%)]" />

      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 600 320"
        preserveAspectRatio="none"
      >
        <line x1="300" y1="160" x2="90" y2="55" stroke="rgba(103,232,249,0.45)" />
        <line x1="300" y1="160" x2="510" y2="55" stroke="rgba(103,232,249,0.45)" />
        <line x1="300" y1="160" x2="60" y2="160" stroke="rgba(103,232,249,0.45)" />
        <line x1="300" y1="160" x2="540" y2="160" stroke="rgba(103,232,249,0.45)" />
        <line x1="300" y1="160" x2="100" y2="270" stroke="rgba(103,232,249,0.45)" />
        <line x1="300" y1="160" x2="500" y2="270" stroke="rgba(103,232,249,0.45)" />
      </svg>

      <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/50 bg-slate-900 text-2xl font-semibold tracking-[0.18em] text-cyan-200 shadow-[0_0_50px_rgba(34,211,238,0.16)]">
        DDC
      </div>

      {nodes.map((node) => (
        <div
          key={node.label}
          className={`absolute ${node.position} rounded-lg border border-amber-500/30 bg-slate-900/95 px-4 py-2 text-xs font-medium text-slate-200 shadow-lg`}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
}

function WhereDDCFitsVisual() {
  const systems = ["ERP", "AI", "IoT", "GRC", "Documents", "Humans"];

  return (
    <div className="relative flex min-h-[290px] items-center justify-center overflow-hidden rounded-2xl border border-amber-500/25 bg-slate-950/90 p-5">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative w-full max-w-[620px] space-y-4">
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-4">
          <div className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Operational Systems
          </div>

          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {systems.map((system) => (
              <div
                key={system}
                className="rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-3 text-center text-xs font-medium text-slate-300"
              >
                {system}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center text-2xl text-amber-300">↓</div>

        <div className="rounded-xl border border-amber-400/50 bg-amber-400/[0.08] px-5 py-5 text-center shadow-[0_0_35px_rgba(251,191,36,0.14)]">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
            Diamond Data Chain
          </div>
          <div className="mt-2 text-xl font-semibold text-white">
            Governance Preservation Layer
          </div>
        </div>

        <div className="flex justify-center text-2xl text-cyan-300">↓</div>

        <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/[0.06] px-5 py-4 text-center">
          <div className="text-sm font-medium leading-6 text-slate-200">
            Independent governance history for audits, investigations,
            regulators and courts
          </div>
        </div>
      </div>
    </div>
  );
}

function CardVisual({ type }: { type: string }) {
  if (type === "ai") return <AIControlRoomVisual />;
  if (type === "timeline") return <TimelineVisual />;
  if (type === "comparison") return <ComparisonVisual />;
  if (type === "fit") return <WhereDDCFitsVisual />;
  return <NetworkVisual />;
}

export default function WhyDDCMattersNow() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          element.classList.remove("opacity-0", "translate-y-[25px]");
          element.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(element);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-ddc-matters"
      className="relative overflow-hidden border-t border-slate-800 bg-slate-950 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute left-[-15%] top-[15%] h-px w-[70%] rotate-[9deg] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
        <div className="absolute right-[-20%] top-[55%] h-px w-[80%] -rotate-[7deg] bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />
        <div className="absolute left-[20%] top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent" />
        <div className="absolute right-[14%] top-0 h-full w-px bg-gradient-to-b from-transparent via-slate-300/10 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div
          data-reveal
          className="mx-auto max-w-4xl translate-y-[25px] text-center opacity-0 transition-all duration-[800ms] ease-out"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.38em] text-cyan-300">
            Why DDC Matters Now
          </div>

          <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
            Intelligence is advancing.
            <br />
            Accountability must advance with it.
          </h2>

          <div className="mx-auto mt-8 max-w-4xl space-y-4 text-lg leading-8 text-slate-300 md:text-xl">
            <p>
              Artificial intelligence is beginning to influence decisions across
              finance, healthcare, manufacturing, energy, logistics and public
              administration.
            </p>

            <p>
              As its role expands, organizations will need more than intelligent
              systems. They will need trustworthy evidence of what happened, who
              approved it and whether those decisions can still be verified years
              later.
            </p>

            <p className="font-medium text-slate-100">
              Diamond Data Chain is being built to provide that foundation.
            </p>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 xl:grid-cols-2">
          {cards.map((card, index) => (
            <article
              key={card.title}
              data-reveal
              style={{ transitionDelay: `${index * 90}ms` }}
              className="group flex min-h-[610px] translate-y-[25px] flex-col rounded-[28px] border border-amber-500/35 xl:last:col-span-2 bg-slate-900/55 p-5 opacity-0 shadow-[0_22px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all duration-[800ms] ease-out hover:-translate-y-1 hover:border-amber-300/70 md:p-7"
            >
              <CardVisual type={card.visual} />

              <div className="flex flex-1 flex-col px-2 pb-3 pt-8 md:px-3">
                <div className="mb-5">
                  <span className="inline-flex rounded-full border border-amber-400/35 bg-amber-400/[0.07] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-200">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold leading-tight text-white md:text-3xl">
                  {card.title}
                </h3>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                  {card.text}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div
          data-reveal
          className="mx-auto mt-28 max-w-5xl translate-y-[25px] border-t border-amber-500/25 pt-16 text-center opacity-0 transition-all duration-[800ms] ease-out"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200/70">
            One question may define the future of trustworthy AI.
          </p>

          <p className="mt-6 text-3xl font-semibold leading-tight text-white md:text-5xl">
            Can important decisions still be verified years later?
          </p>
        </div>
      </div>
    </section>
  );
}
