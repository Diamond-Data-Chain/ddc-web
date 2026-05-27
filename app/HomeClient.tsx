"use client";

import dynamic from "next/dynamic";
import SectionBoundary from "./(sections)/SectionBoundary";

const VestingPools = dynamic(() => import("./(sections)/VestingPools"), { ssr: false, loading: () => null });

const Navbar = dynamic(() => import("./(sections)/Navbar"), { ssr: false, loading: () => null });
const Hero = dynamic(() => import("./(sections)/Hero"), { ssr: false, loading: () => null });
const MyDDCOverview = dynamic(() => import("./(sections)/MyDDCOverview"), { ssr: false, loading: () => null });
const Technology = dynamic(() => import("./(sections)/Technology"), { ssr: false, loading: () => null });
const Tokenomics = dynamic(() => import("./(sections)/Tokenomics"), { ssr: false, loading: () => null });
const PresaleDashboard = dynamic(() => import("./(sections)/PresaleDashboard"), { ssr: false, loading: () => null });
const Transparency = dynamic(() => import("./(sections)/Transparency"), { ssr: false, loading: () => null });
const ESG = dynamic(() => import("./(sections)/ESG"), { ssr: false, loading: () => null });
const Roadmap = dynamic(() => import("./(sections)/Roadmap"), { ssr: false, loading: () => null });
const InvestorSummary = dynamic(() => import("./(sections)/InvestorSummary"), { ssr: false, loading: () => null });
const Developers = dynamic(() => import("./(sections)/Developers"), { ssr: false, loading: () => null });
const FAQ = dynamic(() => import("./(sections)/FAQ"), { ssr: false, loading: () => null });
const Footer = dynamic(() => import("./(sections)/Footer"), { ssr: false, loading: () => null });

export default function HomeClient() {
 return (
 <main className="min-h-screen bg-slate-950 text-slate-50">
 <Navbar />
 <Hero />

 <MyDDCOverview />
 <VestingPools />
 <Technology />
<Tokenomics />

 <SectionBoundary name="PresaleDashboard">
 <PresaleDashboard />
 </SectionBoundary>

 <Transparency />
 <ESG />
 <Roadmap />
 <InvestorSummary />
 <Developers />
 <FAQ />
<Footer />
 </main>
 );
}
