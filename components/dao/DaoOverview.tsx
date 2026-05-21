"use client";

import { useState } from "react";
import { useVotingPower } from "@/dao_materials/DAO/app_dao_hooks_useVotingPower";

export default function DaoOverview() {
 const [address, setAddress] = useState<string>("");

 const { status, votingPower, symbol, decimals, error } = useVotingPower(address);

 return (
 <section className="w-full">
 <div className="mb-4">
 <h2 className="text-xl font-semibold">DAO Overview</h2>
 <p className="text-sm opacity-80">Read-only prikaz voting power-a (on-chain).</p>
 </div>

 <div className="flex flex-col gap-2 max-w-xl">
 <label className="text-sm">Wallet adresa</label>
 <input
 className="border rounded px-3 py-2 bg-transparent"
 placeholder="0x..."
 value={address}
 onChange={(e) => setAddress(e.target.value)}
 />

 <div className="mt-3 border rounded p-3">
 {status === "idle" && <div className="text-sm opacity-80">Enter an address to view voting power.</div>}
 {status === "loading" && <div className="text-sm">Loading…</div>}
 {status === "error" && <div className="text-sm text-red-600">{error ?? "Error"}</div>}
 {status === "success" && (
 <div className="text-sm">
 <div>
 <span className="opacity-80">Token:</span> {symbol ?? "ERC20"}
 </div>
 <div>
 <span className="opacity-80">Decimale:</span> {typeof decimals === "number" ? decimals : "-"}
 </div>
 <div className="mt-2">
 <span className="opacity-80">Voting power:</span>{" "}
 <span className="font-semibold">{votingPower ?? "0"}</span>
 </div>
 </div>
 )}
 </div>
 </div>
 </section>
 );
}
