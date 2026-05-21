// app/(sections)/Navbar.tsx
"use client";


import Link from "next/link";

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
];

export default function Navbar() {
 const [mobileOpen, setMobileOpen] = useState(false);

 return (
 <>
 {/* DESKTOP / GLOBAL NAVBAR */}
 <header className="sticky top-0 z-40 backdrop-blur bg-slate-950/70 border-b border-slate-800">
 <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
 {/* Logo + naziv */}
 <div className="flex items-center gap-3">
 <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-amber-400" />
 <span className="font-semibold tracking-wide">
 Diamond Data Chain (DDC)
 </span>
 </div>

 {/* Desktop nav linkovi */}
 <nav className="hidden md:flex items-center gap-6 text-sm">
 {navLinks.map((link) => (
 <a
 key={link.href}
 href={link.href}
 className="hover:text-amber-300"
 >
 {link.label}
 </a>
 ))}
 </nav>

 {/* Desktop actions */}
 <div className="hidden md:flex items-center gap-3">
<ConnectWalletButton />
 <a
 href="#investor"
 className="px-4 py-2 rounded-2xl bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 transition text-sm"
 >
 Invest
 </a>
 </div>

 {/* Burger dugme (mobilni) */}
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

 {/* MOBILE MENU OVERLAY */}
 {mobileOpen && (
 <>
 {/* Tamna pozadina */}
 <div
 className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
 onClick={() => setMobileOpen(false)}
 />

 {/* Desni panel */}
 <div className="fixed inset-y-0 right-0 z-50 w-72 max-w-[80%] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col">
 <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
 <span className="text-sm font-semibold text-slate-100">
 Menu
 </span>
 <button
 onClick={() => setMobileOpen(false)}
 className="text-slate-400 hover:text-amber-300 text-xl"
 >
 ✕
 </button>
 </div>

 {/* Linkovi */}
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

 {/* Wallet actions in mobile panel */}
 <div className="border-t border-slate-800 px-4 py-4 space-y-3">
 <ConnectWalletButton />
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
