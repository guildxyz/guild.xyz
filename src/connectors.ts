import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"

enum Chains {
  ETHEREUM = 1,
  BSC = 56,
  POLYGON = 137,
  AVALANCHE = 43114,
  XDAI = 100,
  FANTOM = 250,
  ARBITRUM = 42161,
  CELO = 42220,
  HARMONY = 1666600000,
}

const RPC = {
  ETHEREUM: {
    chainId: 1,
    chainName: "Ethereum",
    blockExplorerUrls: ["https://etherscan.io"],
    iconUrls: ["/networkLogos/ethereum.svg"],
    rpcUrls: ["https://main-light.eth.linkpool.io"],
  },
  BSC: {
    chainId: "0x38",
    chainName: "BSC",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
    iconUrls: ["/networkLogos/bsc.svg"],
  },
  POLYGON: {
    chainId: "0x89",
    chainName: "Matic",
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
    iconUrls: ["/networkLogos/polygon.svg"],
  },
  AVALANCHE: {
    chainId: 43114,
    chainName: "Avalanche Mainnet",
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io"],
    iconUrls: ["/networkLogos/avalanche.svg"],
  },
  XDAI: {
    chainId: 100,
    chainName: "xDAI Chain",
    nativeCurrency: {
      name: "xDAI",
      symbol: "XDAI",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.xdaichain.com"],
    blockExplorerUrls: ["https://blockscout.com/poa/xdai"],
    iconUrls: ["/networkLogos/xdai.svg"],
  },
  FANTOM: {
    chainId: 250,
    chainName: "Fantom Opera",
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ftm.tools"],
    blockExplorerUrls: ["https://ftmscan.com"],
    iconUrls: ["/networkLogos/fantom.svg"],
  },
  ARBITRUM: {
    chainId: 42161,
    chainName: "Arbitrum One",
    nativeCurrency: {
      name: "Ether",
      symbol: "AETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
    iconUrls: ["/networkLogos/arbitrum.svg"],
  },
  CELO: {
    chainId: 42220,
    chainName: "Celo Mainnet",
    nativeCurrency: {
      name: "Celo",
      symbol: "CELO",
      decimals: 18,
    },
    rpcUrls: ["https://forno.celo.org"],
    blockExplorerUrls: ["https://explorer.celo.org"],
    iconUrls: ["/networkLogos/celo.svg"],
  },
  HARMONY: {
    chainId: 1666600000,
    chainName: "Harmony",
    nativeCurrency: {
      name: "Harmony",
      symbol: "ONE",
      decimals: 18,
    },
    rpcUrls: ["https://api.harmony.one"],
    blockExplorerUrls: ["https://explorer.harmony.one"],
    iconUrls: ["/networkLogos/harmony.svg"],
  },
}

const supportedChains = [
  "ETHEREUM",
  "POLYGON",
  "AVALANCHE",
  "XDAI",
  "FANTOM",
  "ARBITRUM",
  "CELO",
  "HARMONY",
  "BSC",
]
const supportedChainIds = supportedChains.map((_) => Chains[_])

const injected = new InjectedConnector({ supportedChainIds })

const walletConnect = new WalletConnectConnector({
  supportedChainIds,
  rpc: Object.keys(RPC).reduce(
    (obj, chainName) => ({
      ...obj,
      [Chains[chainName]]: RPC[chainName].rpcUrls[0],
    }),
    {}
  ),
  qrcode: true,
})

export { Chains, RPC, supportedChains, injected, walletConnect }
