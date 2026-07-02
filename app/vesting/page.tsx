const vestingContracts = [
  {
    name: "Presale / Buyer Vesting",
    contract: "DDCPresaleVesting",
    desc: "Controls buyer vesting, claimable balances, TGE unlock and deterministic unlock schedule.",
    href: "https://testnet.bscscan.com/address/0x1ACaC5012dC01f0F9440815EDBe7c345E47C18D3",
  },
  {
    name: "Allocation Vesting Vaults",
    contract: "DDCVestingVault",
    desc: "Supports structured vesting logic for non-public allocations where applicable.",
    href: "/foundation-ddc-token",
  },
];

export default function VestingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-20 text-slate-50">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
          DDC Verification Layer
        </div>

        <h1 className="mt-4 text-4xl font-black md:text-6xl">
          Deterministic Vesting
        </h1>

        <p className="mt-5 max-w-3xl text-slate-300">
          Diamond Data Chain vesting is designed to be deterministic, time-based,
          and publicly verifiable. Claimable amounts are calculated from on-chain
          state and cannot be released outside the defined vesting rules.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {vestingContracts.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="rounded-3xl border border-amber-400/30 bg-slate-900/50 p-6 shadow-[0_0_30px_rgba(251,191,36,0.08)] transition hover:-translate-y-1 hover:border-amber-400/70 hover:shadow-[0_0_35px_rgba(251,191,36,0.18)]"
            >
              <div className="text-sm font-bold uppercase tracking-wide text-amber-300">
                {item.contract}
              </div>
              <h2 className="mt-2 text-xl font-bold text-white">
                {item.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {item.desc}
              </p>
              <div className="mt-5 text-sm font-semibold text-amber-300">
                Open verification →
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-emerald-400/40 bg-emerald-950/20 p-6">
          <h2 className="text-2xl font-black text-emerald-200">
            Vesting Guarantees
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              "No discretionary unlocks",
              "Claimable amount derived from contract state",
              "TGE-based unlock schedule",
              "Buyer claim flow publicly verifiable",
              "Vesting accounting tested",
              "No hidden manual release path",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-emerald-400/20 bg-black/30 p-3 text-sm text-emerald-100"
              >
                ✓ {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-black/40 p-6">
          <h2 className="text-xl font-bold text-amber-200">
            Permissionless Batch Advancement
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Batch advancement is not dependent on a privileged administrator.
            When a batch is sold out or its 102.4-hour duration expires, the
            permissionless <span className="font-mono text-amber-200">advanceIfEnded()</span>{" "}
            function can synchronize the on-chain batch state.
          </p>
          <a
            href="/testing"
            className="mt-5 inline-flex rounded-full border border-amber-400/50 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-500/20"
          >
            View testing evidence →
          </a>
        </div>
      </div>
    </main>
  );
}
