const path = require("path");

require("@nomicfoundation/hardhat-ethers");

require("dotenv").config({
  path: path.resolve(process.env.ENV_FILE || ".env"),
  override: true,
});

if ((process.env.ENV_FILE || ".env") !== ".env") {
  require("dotenv").config({
    path: path.resolve(".env"),
    override: false,
  });
}

/** @type import('hardhat/config').HardhatUserConfig */
const solidity = "0.8.20";

const DEPLOYER_PRIVATE_KEY =
  process.env.DEPLOYER_PRIVATE_KEY ||
  process.env.BOT_PRIVATE_KEY ||
  "";

const accounts = DEPLOYER_PRIVATE_KEY
  ? [DEPLOYER_PRIVATE_KEY]
  : [];

const networks = {
  hardhat: {},
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 31337,
  },
};

const testnetRpc =
  process.env.BSC_TESTNET_RPC_URL ||
  process.env.NEXT_PUBLIC_RPC_URL ||
  "";

if (testnetRpc) {
  networks.bscTestnet = {
    url: testnetRpc,
    chainId: 97,
    accounts,
  };
}

const mainnetRpc =
  process.env.BSC_MAINNET_RPC_URL ||
  "";

if (mainnetRpc) {
  networks.bscMainnet = {
    url: mainnetRpc,
    chainId: 56,
    accounts,
  };
}

module.exports = {
  solidity,
  networks,
};
