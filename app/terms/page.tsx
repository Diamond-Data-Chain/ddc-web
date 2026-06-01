export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24 text-slate-200">
      <h1 className="text-4xl font-bold text-white">Terms of Use</h1>

      <div className="mt-8 space-y-6 text-slate-300">
        <p>
          DDChain is experimental blockchain infrastructure and users participate at their own risk.
        </p>

        <p>
          Nothing on this website constitutes financial, legal, or investment advice.
        </p>

        <p>
          Users are solely responsible for wallet security, transaction verification,
          and compliance with applicable laws in their jurisdiction.
        </p>

        <p>
          Blockchain transactions are irreversible once confirmed on-chain.
        </p>

        <p>
          DDChain reserves the right to improve, update, or modify platform functionality
          during active development phases.
        </p>
      </div>
    </main>
  );
}
