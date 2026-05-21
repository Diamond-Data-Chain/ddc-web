"use client";

import React, { useEffect } from "react";

type Props = {
 open: boolean;
 onClose: () => void;
 hasInjected: boolean;
 onInjected: () => Promise<void> | void;
 onWalletConnect: () => Promise<void> | void;
};

function Icon({ name }: { name: string }) {
 // Simple, recognizable (not pixel-perfect trademark logos)
 // Keeps UI clear without pulling external assets.
 switch (name) {
 case "metamask":
 return (
 <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
 <path fill="#f59e0b" d="M12 2 3 9l3 12 6-4 6 4 3-12-9-7Z" />
 <path fill="#111827" d="M7 12h3l2 2 2-2h3l-2 5-3-2-3 2-2-5Z" opacity="0.85" />
 </svg>
 );
 case "walletconnect":
 return (
 <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
 <path
 fill="#3b82f6"
 d="M8.4 9.2a5.1 5.1 0 0 1 7.2 0l.5.5a.9.9 0 0 0 1.3 0l.8-.8a.9.9 0 0 0 0-1.3l-.5-.5a7.8 7.8 0 0 0-11 0l-.5.5a.9.9 0 0 0 0 1.3l.8.8a.9.9 0 0 0 1.3 0l.5-.5Z"
 />
 <path
 fill="#3b82f6"
 d="M19.2 11.7l-.8-.8a.9.9 0 0 0-1.3 0l-2.2 2.2a.9.9 0 0 1-1.3 0l-1.2-1.2a.9.9 0 0 0-1.3 0l-1.2 1.2a.9.9 0 0 1-1.3 0L6.9 11a.9.9 0 0 0-1.3 0l-.8.8a.9.9 0 0 0 0 1.3l4 4a4.5 4.5 0 0 0 6.4 0l4-4a.9.9 0 0 0 0-1.3Z"
 />
 </svg>
 );
 case "trust":
 return (
 <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
 <path fill="#22c55e" d="M12 2 4 5v7c0 5.3 3.4 9.9 8 10 4.6-.1 8-4.7 8-10V5l-8-3Z" />
 <path fill="#0b1220" d="M8.5 10.5h7L12 18l-3.5-7.5Z" opacity="0.85" />
 </svg>
 );
 case "coinbase":
 return (
 <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
 <circle cx="12" cy="12" r="10" fill="#2563eb" />
 <path
 fill="#fff"
 d="M14.7 9.3a.9.9 0 0 1 0 1.3.9.9 0 0 1-1.3 0A2 2 0 1 0 13.4 14a.9.9 0 0 1 1.3 0 .9.9 0 0 1 0 1.3 3.8 3.8 0 1 1 0-6Z"
 />
 </svg>
 );
 case "okx":
 return (
 <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
 <rect x="2.5" y="6" width="6" height="6" rx="1.2" fill="#e5e7eb" />
 <rect x="9.2" y="6" width="6" height="6" rx="1.2" fill="#e5e7eb" />
 <rect x="15.9" y="6" width="5.6" height="6" rx="1.2" fill="#e5e7eb" />
 <text x="4" y="19" fontSize="7" fill="#e5e7eb" fontFamily="ui-monospace, monospace">
 OKX
 </text>
 </svg>
 );
 case "binance":
 return (
 <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
 <path
 fill="#fbbf24"
 d="M12 2 9.2 4.8 12 7.6l2.8-2.8L12 2Zm-4.4 4.4L4.8 9.2 7.6 12l2.8-2.8-2.8-2.8ZM19.2 9.2l-2.8-2.8-2.8 2.8 2.8 2.8 2.8-2.8ZM12 10.4 9.2 13.2 12 16l2.8-2.8L12 10.4Zm-4.4 4.4L4.8 17.6 7.6 20.4 10.4 17.6l-2.8-2.8Zm8.8 0-2.8 2.8 2.8 2.8 2.8-2.8-2.8-2.8Z"
 />
 </svg>
 );
 case "ledger":
 return (
 <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
 <path fill="#94a3b8" d="M6 6h6v2H8v4H6V6Zm12 6h-6v-2h4V6h2v6Zm-12 6h6v-2H8v-4H6v6Zm12-6v6h-2v-4h-4v-2h6Z" />
 </svg>
 );
 default:
 return (
 <div className="h-6 w-6 rounded bg-slate-700" aria-hidden="true" />
 );
 }
}

function Item({
 icon,
 title,
 subtitle,
 onClick,
 disabled,
}: {
 icon: React.ReactNode;
 title: string;
 subtitle: string;
 onClick: () => void;
 disabled?: boolean;
}) {
 return (
 <button
 type="button"
 disabled={disabled}
 onClick={onClick}
 className={[
 "w-full text-left rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3",
 "hover:bg-slate-900 transition",
 disabled ? "opacity-50 cursor-not-allowed hover:bg-slate-950" : "",
 ].join(" ")}
 >
 <div className="flex items-center gap-3">
 <div className="h-10 w-10 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-center">
 {icon}
 </div>
 <div className="min-w-0">
 <div className="text-sm font-semibold text-slate-50">{title}</div>
 <div className="mt-1 text-xs text-slate-400">{subtitle}</div>
 </div>
 </div>
 </button>
 );
}

export default function WalletSelectModal({
 open,
 onClose,
 hasInjected,
 onInjected,
 onWalletConnect,
}: Props) {
 useEffect(() => {
 if (!open) return;
 const prev = document.body.style.overflow;
 document.body.style.overflow = "hidden";
 return () => {
 document.body.style.overflow = prev;
 };
 }, [open]);

 if (!open) return null;

 const close = () => onClose();

 const clickInjected = async () => {
 close();
 await onInjected();
 };

 const clickWC = async () => {
 close();
 await onWalletConnect();
 };

 return (
 <div className="fixed inset-0 z-[9999]">
 <div className="absolute inset-0 bg-black/70" onClick={close} aria-hidden="true" />

 <div className="absolute inset-0 flex items-start justify-center p-4 pt-16 sm:pt-20">
 <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
 <div className="flex items-start justify-between gap-3 p-5 border-b border-slate-800">
 <div>
 <div className="text-base font-semibold text-slate-50">Connect a wallet</div>
 <div className="mt-1 text-sm text-slate-400">
 Pick a wallet. WalletConnect will show a QR code (works with many wallets).
 </div>
 </div>
 <button
 type="button"
 onClick={close}
 className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800/40 transition"
 >
 Close
 </button>
 </div>

 <div className="p-5 overflow-y-auto overflow-x-hidden max-h-[70vh]">
 <div className="grid gap-3">
 <Item
 icon={<Icon name="metamask" />}
 title="MetaMask / Browser Wallet"
 subtitle={hasInjected ? "Injected browser wallet (no QR needed)." : "No injected wallet detected in this browser."}
 onClick={() => void clickInjected()}
 disabled={!hasInjected}
 />

 <Item
 icon={<Icon name="walletconnect" />}
 title="WalletConnect (QR / Mobile / Cold Wallet)"
 subtitle="Recommended: opens a QR + wallet list (MetaMask Mobile, Trust, Coinbase, Ledger, etc.)."
 onClick={() => void clickWC()}
 />

 <div className="pt-2">
 <div className="text-xs uppercase tracking-wider text-slate-500">WalletConnect shortcuts</div>
 <div className="mt-2 grid gap-2">
 <Item icon={<Icon name="trust" />} title="Trust Wallet" subtitle="Via WalletConnect." onClick={() => void clickWC()} />
 <Item icon={<Icon name="coinbase" />} title="Coinbase Wallet" subtitle="Via WalletConnect." onClick={() => void clickWC()} />
 <Item icon={<Icon name="okx" />} title="OKX Wallet" subtitle="Via WalletConnect." onClick={() => void clickWC()} />
 <Item icon={<Icon name="binance" />} title="Binance Web3 Wallet" subtitle="Via WalletConnect." onClick={() => void clickWC()} />
 <Item icon={<Icon name="ledger" />} title="Ledger / Cold Wallet" subtitle="Via WalletConnect." onClick={() => void clickWC()} />
 </div>
 </div>

 <div className="pt-2 text-xs text-slate-500">
 Note: WalletConnect uses one QR URI that works across many wallet apps.
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
