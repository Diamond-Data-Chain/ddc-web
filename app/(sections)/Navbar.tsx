"use client";

import { useState } from "react";
import ConnectWalletButton from "./ConnectWalletButton";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#technology", label: "Technology" },
  { href: "#tokenomics", label: "Tokenomics" },
  { href: "#presale", label: "Presale" },
  { href: "#transparency", label: "Transparency" },
  { href: "#esg", label: "ESG" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#investor", label: "Investor" },
  { href: "#developers", label: "Developers" },
  { href: "#faq", label: "FAQ" },
];

const docs = [
  { href: "/ddc-vision.pdf", label: "📘 Vision" },
  { href: "/ddc-executive-summary.pdf", label: "📗 Executive Summary" },
  { href: "/ddc-condensed-whitepaper.pdf", label: "📙 Condensed Whitepaper" },
  { href: "/whitepaper.pdf", label: "📕 Full Whitepaper" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-amber-400" />
            <span className="font-semibold tracking-wide">Diamond Data Chain (DDC)</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-amber-300">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ConnectWalletButton />

            <div className="relative">
              <button
                onClick={() => setDocsOpen((v) => !v)}
                className="rounded-full border border-cyan-400/60 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/20 transition"
              >
                Documentation ▼
              </button>

              {docsOpen && (
                <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
                  {docs.map((doc) => (
                    <a
                      key={doc.href}
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-800"
                    >
                      {doc.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#investor"
              className="px-4 py-2 rounded-2xl bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 transition text-sm"
            >
              Invest
            </a>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-200"
            onClick={() => setMobileOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <div className="space-y-1">
              <span className="block h-0.5 w-5 bg-slate-200" />
              <span className="block h-0.5 w-5 bg-slate-200" />
              <span className="block h-0.5 w-5 bg-slate-200" />
            </div>
          </button>
        </div>
      </header>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 z-50 w-72 max-w-[80%] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <span className="text-sm font-semibold text-slate-100">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-slate-400 hover:text-amber-300 text-xl"
              >
                ✕
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-2 py-2 text-slate-200 hover:text-amber-300 hover:bg-slate-800/70"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="border-t border-slate-800 px-4 py-4 space-y-3">
              <ConnectWalletButton />

              <div className="space-y-2">
                {docs.map((doc) => (
                  <a
                    key={doc.href}
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center rounded-xl border border-cyan-400/30 px-4 py-2 text-cyan-100 hover:bg-cyan-500/10"
                    onClick={() => setMobileOpen(false)}
                  >
                    {doc.label}
                  </a>
                ))}
              </div>

              <a
                href="#investor"
                className="block text-center px-4 py-2 rounded-2xl bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 transition text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Invest
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
