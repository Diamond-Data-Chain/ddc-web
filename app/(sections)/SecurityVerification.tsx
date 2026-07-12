"use client";

import { motion } from "framer-motion";

const explorer =
  process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL ||
  "https://testnet.bscscan.com";

const contracts = [
  ["DDC Token / Recorder", process.env.NEXT_PUBLIC_DDC_TOKEN_ADDRESS || ""],
  ["Presale", process.env.NEXT_PUBLIC_PRESALE_ADDRESS || ""],
  ["Reward Pool", process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS || ""],
  ["USDT Test Token", process.env.NEXT_PUBLIC_USDT_ADDRESS || ""],
].filter(([, address]) => Boolean(address));

const docs = [
  ["GitHub Repository", "https://github.com/Diamond-Data-Chain"],
  ["Full Whitepaper", "/whitepaper.pdf"],
  ["Vision", "/ddc-vision.pdf"],
  ["Executive Summary", "/ddc-executive-summary.pdf"],
  ["Condensed Whitepaper", "/ddc-condensed-whitepaper.pdf"],
  ["Our Story", "/ddc-our-story.pdf"],
];

const checks = [
  ["Testing Overview", "/docs/testing/README.md"],
  ["Final Test Report", "/docs/testing/FINAL_TEST_REPORT.md"],
  ["Final Summary", "/docs/testing/FINAL_SUMMARY.md"],
  ["Test Matrix", "/docs/testing/TEST_MATRIX.md"],
  ["Evidence Index", "/docs/testing/EVIDENCE_INDEX.md"],
  ["Known Limitations", "/docs/testing/KNOWN_LIMITATIONS.md"],
];

const status = [
  ["40", "Deterministic Batches"],
  ["256M", "Fixed Supply"],
  ["100%", "On-chain Accounting"],
  ["3/5", "Treasury Multisig"],
  ["24/7", "Public Verification"],
  ["0", "Hidden Mint Functions"],
];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      className="rounded-2xl border border-amber-400/30 bg-slate-900/50 p-5 shadow-[0_0_30px_rgba(251,191,36,0.08)]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{
        translateY: -5,
        borderColor: "rgba(251,191,36,0.7)",
        boxShadow: "0 18px 45px rgba(15,23,42,0.85), 0 0 35px rgba(251,191,36,0.16)",
      }}
    >
      <h3 className="mb-4 text-lg font-bold text-amber-200">{title}</h3>
      {children}
    </motion.div>
  );
}

export default function SecurityVerification() {
  return (
    <section id="verification" className="border-t border-slate-800 py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
            Public Audit Layer
          </div>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">
            Security & Verification
          </h2>
          <p className="mt-4 max-w-4xl text-slate-300">
            Diamond Data Chain is built on deterministic smart contracts, public
            testnet deployment, open-source documentation, and transparent
            on-chain execution. Critical components can be independently checked
            through public blockchain explorers and project repositories.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {status.map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-800 bg-black/40 p-4 text-center"
            >
              <div className="text-2xl font-black text-amber-300">{value}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card title="Smart Contracts">
            <div className="space-y-3">
              {contracts.map(([name, addr]) => (
                <a
                  key={addr}
                  href={`${explorer}/address/${addr}`}
                  target="_self"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-black/35 px-4 py-3 text-sm text-slate-200 hover:border-amber-400/60 hover:text-amber-200"
                >
                  <span>✓ {name}</span>
                  <span className="text-xs text-slate-500">BscScan →</span>
                </a>
              ))}
            </div>
          </Card>

          <Card title="Open Source & Documentation">
            <div className="space-y-3">
              {docs.map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  target="_self"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-black/35 px-4 py-3 text-sm text-slate-200 hover:border-amber-400/60 hover:text-amber-200"
                >
                  <span>✓ {name}</span>
                  <span className="text-xs text-slate-500">Open →</span>
                </a>
              ))}
            </div>
          </Card>

          <Card title="Security Model">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["/treasury","3/5 Multisig Treasury"],
                ["/testing","Permissionless Batch Advancement"],
                ["/vesting","Deterministic Vesting"],
                ["/reward-pool-ddc-token","On-chain Reward Pool"],
                ["/my-record","Immutable Recorder Entries"],
                ["/daily-commits","Daily Treasury Commitments"],
              ].map(([href,item]) => (
                <a
                  key={item}
                  href={href}
                  className="rounded-xl border border-slate-800 bg-black/35 p-3 text-sm text-slate-300 hover:border-amber-400/60 hover:text-amber-200"
                >
                  ✓ {item}
                </a>
              ))}
            </div>
          </Card>

          <Card title="Live Verification">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["/#presale", "Current Presale"],
                ["/treasury", "Treasury Dashboard"],
                ["/reward-pool-ddc-token", "Reward Pool"],
                ["/my-record", "Recorder / My Record"],
                ["/daily-commits", "Daily Commits"],
                ["/ddc-ai-demo-monitor", "AI Monitor Demo"],
              ].map(([href, name]) => (
                <a key={name} href={href} className="rounded-xl border border-slate-800 bg-black/35 p-3 text-sm text-slate-300 hover:border-amber-400/60 hover:text-amber-200">
                  ✓ {name}
                </a>
              ))}
            </div>
          </Card>

          <Card title="Testing Status">
            <div className="grid gap-3 sm:grid-cols-2">
              {checks.map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  target="_self"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-800 bg-black/35 p-3 text-sm text-slate-300 hover:border-amber-400/60 hover:text-amber-200"
                >
                  ✓ {name}
                </a>
              ))}
            </div>
          </Card>

          <Card title="Compliance & Standards">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["/terms", "Terms of Use"],
                ["/privacy", "Privacy Policy"],
                ["/#esg", "ESG Methodology"],
                ["/ddc-condensed-whitepaper.pdf", "DDC Standard"],
                ["/treasury", "Treasury Transparency"],
                ["/whitepaper.pdf", "Legal Disclosures"],
              ].map(([href, name]) => (
                <a key={name} href={href} className="rounded-xl border border-slate-800 bg-black/35 p-3 text-sm text-slate-300 hover:border-amber-400/60 hover:text-amber-200">
                  ✓ {name}
                </a>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8 rounded-3xl border border-emerald-400/40 bg-emerald-950/20 p-6 text-center shadow-[0_0_35px_rgba(52,211,153,0.16)]">
          <div className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">
            DDC v1 Status
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-200">
            READY FOR PUBLIC PRESALE
          </div>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-emerald-100/80">
            Publicly verifiable smart contracts, open documentation,
            deterministic batch logic, treasury transparency, and operational
            verification are available for independent review.
          </p>
        </div>
      </div>
    </section>
  );
}
