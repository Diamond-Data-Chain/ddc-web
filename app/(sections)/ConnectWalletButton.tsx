"use client";

import { useMemo, useState } from "react";
import { useWallet } from "@/app/WalletProvider";
import WalletSelectModal from "@/components/wallet/WalletSelectModal";

function shorten(addr: string) {
 return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export default function ConnectWalletButton({ className = "" }: { className?: string }) {
 const { address, isConnected, disconnect, connectInjected, connectWalletConnect } = useWallet();
 const [open, setOpen] = useState(false);

 const hasInjected = useMemo(() => {
 if (typeof window === "undefined") return false;
 const eth = (window as any)?.ethereum;
 return Boolean(eth?.request);
 }, []);

 const handleClick = async () => {
 if (isConnected) return disconnect();
 setOpen(true);
 };

 return (
 <div className={"flex items-center gap-3 " + className}>
 <button
 onClick={handleClick}
 className="px-5 py-2 rounded-full border border-amber-400/70 bg-black/40 hover:bg-amber-500/10 text-sm font-medium transition-all"
 >
 {isConnected && address ? shorten(address) : "Connect wallet"}
 </button>

 <WalletSelectModal
 open={open}
 onClose={() => setOpen(false)}
 hasInjected={hasInjected}
 onInjected={connectInjected}
 onWalletConnect={connectWalletConnect}
 />
 </div>
 );
}
