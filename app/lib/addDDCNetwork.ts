// app/lib/addDDCNetwork.ts
export async function addDDCNetworkAndSwitch() {
  const ethereum = (window as any).ethereum;

  if (!ethereum) {
    throw new Error("MetaMask not detected. Install the MetaMask extension.");
  }

  // Local development fallback
  const chainIdHex = "0x7a69";

  try {
    // First try to switch to the network if it already exists
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchError: unknown) {
    // If the network does not exist in MetaMask (code 4902), add it
    if (((switchError as any)?.code) === 4902) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chainIdHex,
            chainName: "BNB Smart Chain",
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["http://127.0.0.1:8545"],
            blockExplorerUrls: [],
          },
        ],
      });

      // Nakon dodavanja, prebaci se na nju
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } else {
      // another error
      throw switchError;
    }
  }
}
