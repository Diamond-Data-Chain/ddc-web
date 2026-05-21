"use client";

import { useEffect, useMemo, useState } from "react";
import { Contract } from "ethers";
import { getReadonlyProvider, ADDRESSES } from "@/app/config/contracts";
import rewardPoolArtifact from "@/app/abi/DDCRewardPool.json";

type State =
  | { status: "idle" | "loading"; data?: undefined; error?: undefined }
  | { status: "success"; data: {
      burnLocked: bigint;
      rewardEligible: bigint;
      totalBalance: bigint;
      presaleBurnAccounted: bigint;
      remainingPresaleBurnNeed: bigint;
      presaleBurnTarget: bigint;
      presaleVesting: string;
      ddc: string;
    }; error?: undefined }
  | { status: "error"; data?: undefined; error: string };

export function useRewardPoolStatus() {
  const [state, setState] = useState<State>({ status: "idle" });

  const provider = useMemo(() => getReadonlyProvider(), []);
  const addr = (ADDRESSES as any).rewardPool as string | undefined;

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        if (!addr || addr === "0x0000000000000000000000000000000000000000") {
          setState({ status: "error", error: "REWARD_POOL_ADDRESS is not configured (NEXT_PUBLIC_REWARD_POOL_ADDRESS)." });
          return;
        }
        setState({ status: "loading" });

        const c = new Contract(addr, (rewardPoolArtifact as any).abi, provider);

        const [
          burnLocked,
          rewardEligible,
          presaleBurnAccounted,
          remainingPresaleBurnNeed,
          presaleBurnTarget,
          presaleVesting,
          ddc,
        ] = await Promise.all([
          c.burnLocked() as Promise<bigint>,
          c.rewardEligible() as Promise<bigint>,
          c.presaleBurnAccounted() as Promise<bigint>,
          c.remainingPresaleBurnNeed() as Promise<bigint>,
          c.PRESALE_BURN_TARGET() as Promise<bigint>,
          c.presaleVesting() as Promise<string>,
          c.ddc() as Promise<string>,
        ]);

        const ddcRead = new Contract(
          ddc,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );
        const totalBalance = (await ddcRead.balanceOf(addr)) as bigint;

        if (!alive) return;
        setState({
          status: "success",
          data: { burnLocked, rewardEligible, totalBalance, presaleBurnAccounted, remainingPresaleBurnNeed, presaleBurnTarget, presaleVesting, ddc },
        });
      } catch (e: any) {
        if (!alive) return;
        setState({ status: "error", error: e?.message ?? "RewardPool read error" });
      }
    };

    run();
    const t = setInterval(run, 15000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [addr, provider]);

  return state;
}
