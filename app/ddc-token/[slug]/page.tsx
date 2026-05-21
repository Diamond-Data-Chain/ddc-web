'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const TITLE: Record<string, string> = {
 'reward-pool': 'Reward Pool DDC Token',
 'foundation': 'Foundation DDC Token',
 'team': 'Team DDC Token',
 'advisors': 'Advisors DDC Token',
};

export default function AllocationTokenPage() {
 const params = useParams();
 const slug = String(params?.slug || '');
 const title = TITLE[slug] || 'DDC Token';

 return (
 <main className="min-h-screen bg-slate-950 text-slate-50">
 <div className="mx-auto max-w-5xl px-6 py-10">
 <h1 className="text-2xl font-semibold">{title}</h1>

 <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
 <p className="text-sm text-slate-400">
 On-chain “transakcioni log” za ove alokacije se u v1 prikazuje kroz treasury tokove i/ili kroz
 relevantne ugovore kada budu aktivirani. Trenutno je proverljiv treasury status i tokovi na:
 </p>

 <div className="mt-4 flex flex-wrap gap-2">
 <Link
 href="/treasury"
 className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm hover:bg-slate-800/40 transition"
 >
 Treasury DDC Token
 </Link>

 <Link
 href="/public-ddc-token"
 className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm hover:bg-slate-800/40 transition"
 >
 Public DDC Token
 </Link>
 </div>

 <div className="mt-4 text-xs text-slate-500">
 TODO(WP): kada RewardPool/Vesting/Allocation ugovori budu deo live flow-a, ovde se dodaje direktno logovanje po toj alokaciji.
 </div>
 </div>
 </div>
 </main>
 );
}
