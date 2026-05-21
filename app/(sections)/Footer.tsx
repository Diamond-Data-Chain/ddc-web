import SocialLinks from "@/components/common/SocialLinks";
// app/(sections)/Footer.tsx
export default function Footer() {
 return (
 <footer className="border-t border-slate-800">
 <div className="max-w-7xl mx-auto px-4 py-10 text-sm text-slate-400 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
 <div>© 2025 Diamond Data Chain. All rights reserved.</div>
 <div className="flex gap-6">
 <a href="#" className="hover:text-amber-300">Privacy</a>
 <a href="#" className="hover:text-amber-300">Terms</a>
 <a href="#" className="hover:text-amber-300">Contact</a>
 </div>
 </div>
 <div className="mt-6 flex justify-center">
 <SocialLinks />
 </div>
</footer>
 );
}
