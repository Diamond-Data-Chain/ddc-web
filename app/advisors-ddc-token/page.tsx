import Link from "next/link";
import SingleAllocationVesting from "@/components/tokenomics/SingleAllocationVesting";

export default function AdvisorsDdcTokenPage() {
 return (
 <main className="min-h-screen bg-black text-amber-50">
 <div className="mx-auto max-w-7xl px-4 py-8">
 <div className="mb-6 flex items-center justify-between gap-4">
 <div>
 <h1 className="text-2xl font-semibold text-amber-200">Advisors DDC Token</h1>
 <p className="mt-1 text-sm text-amber-100/70">Focused Advisors allocation view.</p>
 </div>
 <Link
 href="/#tokenomics"
 className="inline-flex items-center justify-center rounded-full border border-amber-400/70 bg-black/40 px-5 py-2 text-sm font-medium transition-all hover:bg-amber-500/10"
 >
 Back to tokenomics
 </Link>
 </div>

 <SingleAllocationVesting allocation="ADVISORS" />
 </div>
 </main>
 );
}
