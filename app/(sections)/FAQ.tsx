"use client";

const FAQS = [
  {
    q: "How does the DDC presale work?",
    a: "DDC uses a deterministic 40-batch presale system deployed fully on-chain on BNB Smart Chain."
  },
  {
    q: "Can the token supply increase later?",
    a: "No. DDC uses a single fixed total supply deployment model."
  },
  {
    q: "How are presale allocations handled?",
    a: "Buyer allocations are tracked fully on-chain through the DDCPresaleVesting contract."
  },
  {
    q: "Is vesting handled on-chain?",
    a: "Yes. Vesting accounting and claim logic are enforced directly by smart contracts."
  },
  {
    q: "How are team allocations protected?",
    a: "Team and advisor allocations are locked in dedicated vesting vault contracts with linear unlock schedules."
  },
  {
    q: "Who controls treasury operations?",
    a: "Treasury operations are controlled through a multisig Safe operational model."
  },
  {
    q: "Can the presale be paused?",
    a: "Yes. Emergency pause protection exists under multisig control."
  },
  {
    q: "Is the presale finalized automatically?",
    a: "Finalize execution is permissionless after presale completion and follows deterministic accounting rules."
  },
];

export default function FAQ() {
  return (
    <section className="w-full px-6 py-24 bg-slate-950 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
          FAQ
        </h2>

        <div className="space-y-6">
          {FAQS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                {item.q}
              </h3>

              <p className="text-slate-300 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
