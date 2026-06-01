"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-slate-200">
      <h1 className="text-4xl font-bold text-white">Contact Support</h1>

      <p className="mt-4 text-slate-400">
        Questions, technical issues, partnerships, or enterprise inquiries.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-6 rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-8"
      >
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Name
          </label>

          <input
            type="text"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Email
          </label>

          <input
            type="email"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Message
          </label>

          <textarea
            required
            rows={6}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
        >
          Send Message
        </button>

        {sent && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
            Message submitted successfully.
          </div>
        )}
      </form>
    </main>
  );
}
