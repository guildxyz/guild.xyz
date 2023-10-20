import { defineChain } from "viem"

export const bobaAvax = /*#__PURE__*/ defineChain({
  id: 43288,
  name: "Boba-Avax L2",
  network: "bobaAvax",
  nativeCurrency: {
    decimals: 18,
    name: "Boba",
    symbol: "BOBA",
  },
  rpcUrls: {
    default: { http: ["https://avax.boba.network"] },
    public: { http: ["https://avax.boba.network"] },
  },
  blockExplorers: {
    default: {
      name: "BlockScout",
      url: "https://blockexplorer.avax.boba.network",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 94846,
    },
  },
})

export const palm = /*#__PURE__*/ defineChain({
  id: 11297108109,
  name: "Palm",
  network: "palm",
  nativeCurrency: {
    decimals: 18,
    name: "Palm",
    symbol: "PALM",
  },
  rpcUrls: {
    default: {
      http: ["https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b"],
    },
    public: {
      http: ["https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b"],
    },
  },
  blockExplorers: {
    default: {
      name: "BlockScout",
      url: "https://explorer.palm.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0x0216a640c4d53f2a6603042d4e14a2b890efcd45",
      blockCreated: 13483902,
    },
  },
})

export const exosama = /*#__PURE__*/ defineChain({
  id: 2109,
  name: "Exosama",
  network: "exosama",
  nativeCurrency: {
    decimals: 18,
    name: "Moonsama",
    symbol: "SAMA",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.exosama.com"],
    },
    public: {
      http: ["https://rpc.exosama.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "BlockScout",
      url: "https://explorer.exosama.com",
    },
  },
})

export const scrollAlpha = /*#__PURE__*/ defineChain({
  id: 534353,
  name: "Scroll Alpha",
  network: "scrollAlpha",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://alpha-rpc.scroll.io/l2"],
    },
    public: {
      http: ["https://alpha-rpc.scroll.io/l2"],
    },
  },
  blockExplorers: {
    default: {
      name: "BlockScout",
      url: "https://blockscout.scroll.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0xd152cd6f9cf76921759d3f51f743651e549f6925",
      blockCreated: 47009,
    },
  },
})

export const goerli = /*#__PURE__*/ defineChain({
  id: 5,
  name: "Görli",
  network: "goerli",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://ethereum-goerli.publicnode.com"],
    },
    public: {
      http: ["https://ethereum-goerli.publicnode.com"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Etherscan",
      url: "https://goerli.etherscan.io",
    },
    default: {
      name: "Etherscan",
      url: "https://goerli.etherscan.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 6507670,
    },
  },
})
