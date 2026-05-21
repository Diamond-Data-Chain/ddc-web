'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ethers } from 'ethers';

type WalletState = {
 address: string | null;
 chainId: number | null;
 isConnected: boolean;

 // Backward compatible
 connect: () => Promise<void>;
 disconnect: () => Promise<void>;

 // Explicit options
 connectInjected: () => Promise<void>;
 connectWalletConnect: () => Promise<void>;

 // Old API expected by PresaleDashboard
 addNetwork: () => Promise<void>;
 switchToExpectedChain: () => Promise<boolean>;

 // Providers
 publicProvider: ethers.JsonRpcProvider | null;
 walletProvider: ethers.BrowserProvider | null;
 signer: ethers.Signer | null;

 // Aliases
 provider: ethers.BrowserProvider | null;
 rpcProvider: ethers.JsonRpcProvider | null;

 wcAvailable: boolean;
 lastError: string | null;
};

const Ctx = createContext<WalletState | null>(null);

function getEnvNumber(v?: string | null): number | null {
 if (!v) return null;
 const n = Number(v);
 return Number.isFinite(n) ? n : null;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
 const chainIdEnv = getEnvNumber(process.env.NEXT_PUBLIC_CHAIN_ID) ?? 31337;
 const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || '';
 const wcProjectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '';

 const publicProvider = useMemo(() => {
 if (!rpcUrl) return null;
 try {
 return new ethers.JsonRpcProvider(rpcUrl);
 } catch {
 return null;
 }
 }, [rpcUrl]);

 const [address, setAddress] = useState<string | null>(null);
 const [chainId, setChainId] = useState<number | null>(null);
 const [walletProvider, setWalletProvider] = useState<ethers.BrowserProvider | null>(null);
 const [signer, setSigner] = useState<ethers.Signer | null>(null);
 const [lastError, setLastError] = useState<string | null>(null);

 const wcProviderRef = useRef<any>(null);
 const wcModalRef = useRef<any>(null);

 const wcAvailable = Boolean(wcProjectId);

 async function syncFromEip1193(p: any, preferredAddress?: string | null) {
 const bp = new ethers.BrowserProvider(p);
 setWalletProvider(bp);

 let s: ethers.Signer;
 if (preferredAddress) {
 try {
 s = await bp.getSigner(preferredAddress);
 } catch {
 s = await bp.getSigner();
 }
 } else {
 s = await bp.getSigner();
 }

 setSigner(s);
 const addr = await s.getAddress();
 setAddress(addr);
 const net = await bp.getNetwork();
 setChainId(Number(net.chainId));
 }

 async function connectInjected() {
 setLastError(null);
 const eth = (globalThis as any)?.ethereum;
 if (!eth?.request) {
 setLastError('MetaMask/injected provider not detected (window.ethereum).');
 return;
 }
 try {
 await eth.request({
 method: 'wallet_requestPermissions',
 params: [{ eth_accounts: {} }],
 });
 } catch {}

 const requested = await eth.request({ method: 'eth_requestAccounts' });
 const pickedAddress =
 Array.isArray(requested) && requested.length > 0 ? String(requested[0]) : null;

 await syncFromEip1193(eth, pickedAddress);

 eth.on?.('accountsChanged', async (accs: string[]) => {
 const next = accs?.[0] || null;
 if (!next) {
 setAddress(null);
 setChainId(null);
 setWalletProvider(null);
 setSigner(null);
 return;
 }
 try {
 await syncFromEip1193(eth, next);
 } catch {
 setAddress(next);
 }
 });
 eth.on?.('chainChanged', async () => {
 try {
 const bp = new ethers.BrowserProvider(eth);
 const net = await bp.getNetwork();
 setChainId(Number(net.chainId));
 } catch {}
 });
 eth.on?.('disconnect', () => {
 setAddress(null);
 setChainId(null);
 setWalletProvider(null);
 setSigner(null);
 });
 }

 async function initWalletConnectIfNeeded() {
 if (!wcProjectId) return;
 if (wcProviderRef.current && wcModalRef.current) return;

 try {
 const EthereumProvider = (await import('@walletconnect/ethereum-provider')).default;
 const { WalletConnectModal } = await import('@walletconnect/modal');

 const rpcMap: Record<number, string> = {};
 if (rpcUrl) rpcMap[chainIdEnv] = rpcUrl;

 const provider = await EthereumProvider.init({
 projectId: wcProjectId,
 chains: [chainIdEnv],
 optionalChains: [chainIdEnv],
 rpcMap,
 showQrModal: false,
 methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData', 'eth_signTypedData_v4'],
 events: ['accountsChanged', 'chainChanged', 'disconnect'],
 metadata: {
 name: 'DDC Presale',
 description: 'DDC Presale dApp',
 url: 'https://diamonddatachain.org',
 icons: [],
 },
 });

 const modal = new WalletConnectModal({
 projectId: wcProjectId,
 chains: [String(chainIdEnv)],
 });

 provider.on('display_uri', (uri: string) => modal.openModal({ uri }));

 provider.on('accountsChanged', (accs: string[]) => setAddress(accs?.[0] || null));
 provider.on('chainChanged', (c: number | string) => {
 const n = typeof c === 'string' ? Number(c) : Number(c);
 setChainId(Number.isFinite(n) ? n : null);
 });
 provider.on('disconnect', () => {
 setAddress(null);
 setChainId(null);
 setWalletProvider(null);
 setSigner(null);
 });

 wcProviderRef.current = provider;
 wcModalRef.current = modal;
 } catch (e: any) {
 console.warn('WalletConnect init failed; disabled for this session.', e);
 setLastError(`WalletConnect init failed: ${e?.message ?? String(e)}`);
 wcProviderRef.current = null;
 wcModalRef.current = null;
 }
 }

 async function connectWalletConnect() {
 setLastError(null);
 if (!wcProjectId) {
 setLastError('NEXT_PUBLIC_WC_PROJECT_ID is not set.');
 return;
 }

 await initWalletConnectIfNeeded();
 const p = wcProviderRef.current;
 const modal = wcModalRef.current;
 if (!p || !modal) return;

 try {
 await p.connect();
 try { modal.closeModal(); } catch {}
 await syncFromEip1193(p);
 } catch (e: any) {
 setLastError(`WalletConnect connect failed: ${e?.message ?? String(e)}`);
 try { modal.closeModal(); } catch {}
 }
 }

 // ✅ Backward compatible connect()
 async function connect() {
 setLastError(null);
 const eth = (globalThis as any)?.ethereum;
 if (eth?.request) {
 return connectInjected();
 }
 return connectWalletConnect();
 }

 // ✅ Expected by existing UI: addNetwork()
 async function addNetwork() {
 setLastError(null);
 const eth = (globalThis as any)?.ethereum;
 if (!eth?.request) {
 setLastError('Ne mogu add/switch network bez window.ethereum.');
 return;
 }

 const chainIdHex = '0x' + Number(chainIdEnv).toString(16);
 try {
 await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: chainIdHex }] });
 return;
 } catch (e: any) {
 // 4902 = unknown chain
 if (e?.code !== 4902) {
 setLastError(`wallet_switchEthereumChain failed: ${e?.message ?? String(e)}`);
 return;
 }
 }

 // Add chain (minimal)
 try {
 const isLocal = Number(chainIdEnv) === 31337;
 await eth.request({
 method: 'wallet_addEthereumChain',
 params: [
 {
 chainId: chainIdHex,
 chainName: chainIdEnv === 56 ? 'BNB Smart Chain' : chainIdEnv === 97 ? 'BNB Smart Chain Testnet' : `Chain ${chainIdEnv}`,
 rpcUrls: rpcUrl ? [rpcUrl] : [],
 nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
 blockExplorerUrls: [],
 },
 ],
 });
 } catch (e: any) {
 setLastError(`wallet_addEthereumChain failed: ${e?.message ?? String(e)}`);
 }
 }

 async function disconnect() {
 setLastError(null);
 try {
 if (wcProviderRef.current?.disconnect) {
 await wcProviderRef.current.disconnect();
 }
 } catch {}
 setAddress(null);
 setChainId(null);
 setWalletProvider(null);
 setSigner(null);
 }

 useEffect(() => {
 let mounted = true;
 (async () => {
 try {
 if (!publicProvider) return;
 const net = await publicProvider.getNetwork();
 if (mounted) setChainId(Number(net.chainId));
 } catch {}
 })();
 return () => { mounted = false; };
 }, [publicProvider]);

 const value: WalletState = {
 address,
 chainId,
 isConnected: Boolean(address),

 connect,
 disconnect,

 connectInjected,
 connectWalletConnect,
 addNetwork,
 switchToExpectedChain,

 publicProvider,
 walletProvider,
 signer,

 provider: walletProvider,
 rpcProvider: publicProvider,

 wcAvailable,
 lastError,
 };

 return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

 async function switchToExpectedChain(): Promise<boolean> {
 try {
 const eth = (typeof window !== "undefined" ? (window as any).ethereum : null);
 if (!eth?.request) return false;

 const expected = process.env.NEXT_PUBLIC_CHAIN_ID ? Number(process.env.NEXT_PUBLIC_CHAIN_ID) : 97;
 const chainIdHex = "0x" + expected.toString(16);

 try {
 await eth.request({
 method: "wallet_switchEthereumChain",
 params: [{ chainId: chainIdHex }],
 });
 return true;
 } catch (e: any) {
 // 4902 = unknown chain -> add it
 const code = e?.code ?? e?.data?.originalError?.code;
 if (code !== 4902) throw e;
 }

 // Add chain fallback (BNB testnet defaults if unknown)
 const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://data-seed-prebsc-1-s1.bnbchain.org:8545";
 const blockExplorerUrls =
 expected === 97 ? ["https://testnet.bscscan.com"] :
 expected === 56 ? ["https://bscscan.com"] : [];

 const chainName =
 expected === 97 ? "BNB Smart Chain Testnet" :
 expected === 56 ? "BNB Smart Chain" : `Chain ${expected}`;

 const nativeCurrency =
 expected === 97 ? { name: "tBNB", symbol: "tBNB", decimals: 18 } :
 expected === 56 ? { name: "BNB", symbol: "BNB", decimals: 18 } :
 { name: "Native", symbol: "NATIVE", decimals: 18 };

 await eth.request({
 method: "wallet_addEthereumChain",
 params: [{
 chainId: chainIdHex,
 chainName,
 rpcUrls: [rpcUrl],
 nativeCurrency,
 blockExplorerUrls,
 }],
 });

 // After add, switch again
 await eth.request({
 method: "wallet_switchEthereumChain",
 params: [{ chainId: chainIdHex }],
 });

 return true;
 } catch (err) {
 console.error("switchToExpectedChain failed:", err);
 return false;
 }
 }


export function useWallet() {
 const v = useContext(Ctx);
 if (!v) throw new Error('useWallet must be used within WalletProvider');
 return v;
}
