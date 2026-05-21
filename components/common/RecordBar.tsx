"use client";

import Link from "next/link";

export default function RecordBar() {
 return (
 <div className="border-t border-amber-500/30 bg-black/30">
 <div className="mx-auto max-w-7xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
 <div className="text-xs text-amber-100/70">
 DDC token zapis (on-chain): proverljivo bez “trust me”.
 </div>
 <div className="flex flex-wrap gap-2">
 <Link
 href="/my-record"
 className="inline-flex items-center justify-center rounded-full border border-amber-400/70 bg-black/40 hover:bg-amber-500/10 text-sm font-medium transition-all px-5 py-2"
 >
 My DDC Token
 </Link>
 <Link
 href="/treasury"
 className="inline-flex items-center justify-center rounded-full border border-amber-500/40 bg-black/40 px-5 py-2 text-sm hover:bg-black/30/40 transition"
 >
 Treasury DDC Token
 </Link>
 </div>
 </div>
 </div>
 );
}
