export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-slate-200">
      <h1 className="text-4xl font-bold text-white">Contact Support</h1>

      <p className="mt-4 text-slate-400">
        Technical support, partnerships, enterprise inquiries, or ecosystem collaboration.
      </p>

      <div className="mt-10 rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-8">
        <p className="text-lg text-slate-200 mb-4">
          Support Email
        </p>

        <a
          href="mailto:ddc.protocol@gmail.com"
          className="text-cyan-300 underline text-xl"
        >
          ddc.protocol@gmail.com
        </a>
      </div>
    </main>
  );
}
