// app/(sections)/DDCAnimatedLogo.tsx

export default function DDCAnimatedLogo({
 src = "/assets/images/diamond-from-whitepaper.png"
}: {
 src?: string;
}) {
 return (
 <div className="relative w-full max-w-sm mx-auto select-none">
 <svg
 viewBox="0 0 400 400"
 className="w-full h-auto drop-shadow-2xl"
 >
 <defs>
 {/* Wider ring so the text does not overlap the diamond */}
 <path
 id="ddcCircle"
 d="M 200,200 m -150,0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0"
 />

 <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
 <feGaussianBlur stdDeviation="3" result="coloredBlur" />
 <feMerge>
 <feMergeNode in="coloredBlur" />
 <feMergeNode in="SourceGraphic" />
 </feMerge>
 </filter>
 </defs>

 {/* DIJAMANT – sada ispod teksta */}
 <image
 href={src}
 x="110"
 y="110"
 width="180"
 height="180"
 preserveAspectRatio="xMidYMid slice"
 filter="url(#glow)"
 style={{ zIndex: 1 }}
 />

 {/* Rotating text above the diamond */}
 <g
 className="ddc-rotate"
 style={{
 transformOrigin: "200px 200px",
 zIndex: 5
 }}
 >
 <text
 fill="#D4AF37"
 fontSize="22"
 letterSpacing="3"
 style={{ fontWeight: 600 }}
 >
 <textPath
 href="#ddcCircle"
 startOffset="0%"
 textLength="940"
 lengthAdjust="spacingAndGlyphs"
 >
 • DiamondDataChain • DiamondDataChain • DiamondDataChain 
 </textPath>
 </text>
 </g>
 </svg>

 <style>{`
 @keyframes spinSlow {
 from { transform: rotate(0deg); }
 to { transform: rotate(360deg); }
 }
 .ddc-rotate {
 animation: spinSlow 12s reverse infinite;
 }
 `}</style>

 <div className="mt-3 text-center text-amber-300 font-semibold tracking-wide">
 Diamond Data Chain
 </div>
 </div>
 );
}
