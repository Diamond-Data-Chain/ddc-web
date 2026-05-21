"use client";

import { useEffect, useState } from "react";
import { DDC_TOKEN_ADDRESS, CHAIN_ID, RPC_URL } from "@/app/config/contracts";


export default function Header() {
 const [walletAddress, setWalletAddress] = useState<string>("");
 const [walletMenuOpen, setWalletMenuOpen] = useState(false);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

 const shortAddress =
 walletAddress && walletAddress.length > 10
 ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)
 : "Connect";

 // auto-check whether wallet is already connected
 useEffect(() => {
 if (!window.ethereum) return;

 window.ethereum
 .request({ method: "eth_accounts" })
 .then((acc: unknown) => {
 const accounts = Array.isArray(acc) ? (acc as string[]) : [];
 if (accounts.length > 0) {
 setWalletAddress(accounts[0]);
 }
 })
 .catch(() => {});
 }, []);

 async function handleConnectWallet() {
 if (!window.ethereum) {
 alert("MetaMask not detected.");
 return;
 }

 try {
 const result = await window.ethereum.request({ method: "eth_requestAccounts" });
 const accounts = Array.isArray(result) ? (result as string[]) : [];
 if (accounts.length > 0) {
 setWalletAddress(accounts[0]);
 }
 } catch (err) {
 console.error(err);
 }
 }

 async function ensureNetwork() {
 if (!window.ethereum) return;
 const chainIdHex =
 "0x" + Number(CHAIN_ID || 31337).toString(16);

 try {
 await window.ethereum.request({
 method: "wallet_switchEthereumChain",
 params: [{ chainId: chainIdHex }],
 });
 } catch (err) {
 console.warn("wallet_switchEthereumChain error", err);
 }
 }

 async function handleAddNetwork() {
 if (!window.ethereum) {
 alert("MetaMask not detected.");
 return;
 }

 const chainIdDec = Number(CHAIN_ID || 31337);
 const chainIdHex = "0x" + chainIdDec.toString(16);

 try {
 await window.ethereum.request({
 method: "wallet_addEthereumChain",
 params: [
 {
 chainId: chainIdHex,
 chainName: "BNB Smart Chain",
 rpcUrls: [RPC_URL || "http://127.0.0.1:8545"],
 nativeCurrency: {
 name: "Ether",
 symbol: "ETH",
 decimals: 18,
 },
 },
 ],
 });
 } catch (err) {
 console.error(err);
 }
 }

 async function handleAddToken() {
 if (!window.ethereum) {
 alert("MetaMask not detected.");
 return;
 }

 try {
 await window.ethereum.request({
 method: "wallet_watchAsset",
 params: {
 type: "ERC20",
 options: {
 address: DDC_TOKEN_ADDRESS,
 symbol: "DDC",
 decimals: 18,
 },
 },
 });
 } catch (err) {
 console.error(err);
 }
 }

 const navLinks = [
 { label: "Home", href: "#home" },
 { label: "Technology", href: "#technology" },
 { label: "Tokenomics", href: "#tokenomics" },
 { label: "Presale", href: "#presale" },
 { label: "Transparency", href: "#transparency" },
 { label: "ESG", href: "#esg" },
 { label: "Roadmap", href: "#roadmap" },
 { label: "Investor", href: "#investor" },
 { label: "Developers", href: "#developers" },
 { label: "DAO", href: "#dao" },
 ];

 function handleNavClick(href: string) {
 if (href.startsWith("#")) {
 const el = document.querySelector(href);
 if (el) {
 el.scrollIntoView({ behavior: "smooth", block: "start" });
 }
 } else {
 window.location.href = href;
 }
 }

 return (
 <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-black/80 backdrop-blur-xl">
 <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
 {/* left: logo */}
 <div className="flex items-center gap-2">
 <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-400 to-indigo-500 shadow-[0_0_25px_rgba(251,191,36,0.9)]" />
 <div className="flex flex-col leading-tight">
 <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
 Diamond Data Chain
 </span>
 <span className="text-sm font-semibold text-slate-100">
 DDC Network
 </span>
 </div>
 </div>

 {/* center: nav */}
 <nav className="hidden flex-1 items-center justify-center md:flex">
 <div className="flex max-w-[620px] items-center gap-4 overflow-x-auto px-2 text-[0.75rem] text-slate-300">
 {navLinks.map((link) => (
 <button
 key={link.label}
 onClick={() => handleNavClick(link.href)}
 className="whitespace-nowrap text-xs text-slate-300 hover:text-amber-200"
 >
 {link.label}
 </button>
 ))}
 </div>
 </nav>

 {/* right: CTAs + wallet dropdown */}
 <div className="flex items-center gap-2">
 {/* Invest button */}
 <button className="hidden rounded-full border border-amber-500/60 bg-amber-500/10 px-3 py-1.5 text-[0.7rem] font-semibold text-amber-100 hover:bg-amber-500/20 md:inline-flex">
 Invest
 </button>
 {/* Wallet dropdown */}
 <div className="relative">
 <button
 onClick={async () => {
 if (!walletAddress) {
 await handleConnectWallet();
 await ensureNetwork();
 return;
 }
 setWalletMenuOpen((v) => !v);
 }}
 className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[0.75rem] text-slate-100"
 >
 <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
 <span className="font-mono">{shortAddress}</span>
 </button>

 {walletMenuOpen && (
 <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-700 bg-slate-950/95 p-2 text-xs shadow-xl">
 <button
 onClick={handleAddNetwork}
 className="w-full rounded-lg px-2 py-1 text-left text-slate-200 hover:bg-slate-900"
 >
 Add DDC Network
 </button>
 <button
 onClick={handleAddToken}
 className="mt-1 w-full rounded-lg px-2 py-1 text-left text-slate-200 hover:bg-slate-900"
 >
 Add DDC Token
 </button>
 </div>
 )}
 </div>

 {/* mobile burger */}
 <button
 className="inline-flex items-center justify-center rounded-md border border-slate-700 p-1.5 text-slate-300 md:hidden"
 onClick={() => setMobileMenuOpen((v) => !v)}
 >
 <span className="material-icons text-base">
 {mobileMenuOpen ? "close" : "menu"}
 </span>
 </button>
 </div>
 </div>

 {/* mobile nav */}
 {mobileMenuOpen && (
 <div className="border-t border-slate-800 bg-black/95 px-4 py-3 md:hidden">
 <div className="flex flex-wrap gap-3 text-[0.8rem] text-slate-300">
 {navLinks.map((link) => (
 <button
 key={link.label}
 onClick={() => {
 handleNavClick(link.href);
 setMobileMenuOpen(false);
 }}
 className="whitespace-nowrap text-left hover:text-amber-200"
 >
 {link.label}
 </button>
 ))}
 </div>
 </div>
 )}
 </header>
 );
}
