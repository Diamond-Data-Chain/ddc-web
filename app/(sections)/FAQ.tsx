"use client";

const FAQS = [
  {
    q: "What is Diamond Data Chain (DDC)?",
    a: "Diamond Data Chain is a blockchain infrastructure project focused on secure data systems, transparency, decentralized validation, and enterprise-grade digital trust."
  },
  {
    q: "What problem does DDC solve?",
    a: "DDC is designed to improve trust, auditability, and long-term integrity of digital records and data processes across decentralized environments."
  },
  {
    q: "Why does DDC use blockchain technology?",
    a: "Blockchain infrastructure allows DDC to provide transparent, tamper-resistant, and verifiable data operations without relying on centralized control."
  },
  {
    q: "What is the purpose of the DDC Coin?",
    a: "DDC Coin is the native asset of the ecosystem and is intended to support network participation, ecosystem incentives, future governance, and protocol-level utility."
  },
  {
    q: "How does the presale work?",
    a: "The DDC presale operates fully on-chain through a deterministic batch-based system deployed on BNB Smart Chain."
  },
  {
    q: "Can the total supply increase later?",
    a: "No. DDC uses a fixed total supply model established during deployment."
  },
  {
    q: "How are team and advisor allocations handled?",
    a: "Team and advisor allocations are managed through dedicated vesting vaults with predefined unlock schedules."
  },
  {
    q: "Is the project focused on long-term infrastructure?",
    a: "Yes. DDC is designed as a long-term infrastructure and ecosystem project rather than a short-term speculative launch."
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="w-full px-6 py-24 bg-slate-950 border-t border-slate-800">
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
