export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-slate-200">
      <h1 className="text-4xl font-bold text-white">Contact Support</h1>

      <p className="mt-4 text-slate-400">
        Technical support, partnerships, enterprise inquiries, or ecosystem collaboration.
      </p>

      <p className="mt-4 text-cyan-300">
        Direct email:{" "}
        <a className="underline hover:text-cyan-200" href="mailto:ddc.protocol@gmail.com">
          ddc.protocol@gmail.com
        </a>
      </p>

      <form
        action="https://formsubmit.co/ddc.protocol@gmail.com"
        method="POST"
        className="mt-10 space-y-6 rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-8"
      >
        <input type="hidden" name="_subject" value="DDChain Support Request" />
        <input type="hidden" name="_captcha" value="false" />

        <div>
          <label className="mb-2 block text-sm text-slate-300">Name</label>
          <input name="name" type="text" required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400" />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Email</label>
          <input name="email" type="email" required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400" />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Message</label>
          <textarea name="message" required rows={6} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400" />
        </div>

        <button type="submit" className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400">
          Send Message
        </button>
      </form>
    </main>
  );
}
