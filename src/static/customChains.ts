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
      url: "https://alpha-blockscout.scroll.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0xd152cd6f9cf76921759d3f51f743651e549f6925",
      blockCreated: 47009,
    },
  },
})

export const pgn = /*#__PURE__*/ defineChain({
  id: 424,
  name: "PGN",
  network: "pgn",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.publicgoods.network"],
    },
    public: {
      http: ["https://rpc.publicgoods.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "BlockScout",
      url: "https://explorer.publicgoods.network",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 3380209,
    },
  },
})

export const neonEVM = /*#__PURE__*/ defineChain({
  id: 245022934,
  name: "Neon EVM",
  network: "neonEVM",
  nativeCurrency: {
    decimals: 18,
    name: "Neon",
    symbol: "NEON",
  },
  rpcUrls: {
    default: {
      http: ["https://neon-mainnet.everstake.one"],
    },
    public: {
      http: ["https://neon-mainnet.everstake.one"],
    },
  },
  blockExplorers: {
    default: {
      name: "Neonscan",
      url: "https://neonscan.org",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 206545524,
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

export const lukso = /*#__PURE__*/ defineChain({
  id: 42,
  name: "LUKSO Mainnet",
  network: "lukso",
  nativeCurrency: {
    decimals: 18,
    name: "LUKSO",
    symbol: "LYX",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mainnet.lukso.network"],
    },
    public: {
      http: ["https://rpc.mainnet.lukso.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "BlockScout",
      url: "https://explorer.execution.mainnet.lukso.network",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 468183,
    },
  },
})

export const shimmer = /*#__PURE__*/ defineChain({
  id: 148,
  name: "Shimmer EVM",
  network: "shimmer-evm-mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Shimmer",
    symbol: "SMR",
  },
  rpcUrls: {
    default: {
      http: ["https://json-rpc.evm.shimmer.network"],
    },
    public: {
      http: ["https://json-rpc.evm.shimmer.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Shimmer",
      url: "https://explorer.evm.shimmer.network/shimmer",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 1290,
    },
  },
})

export const kava = /*#__PURE__*/ defineChain({
  id: 2222,
  name: "Kava",
  network: "kava",
  nativeCurrency: {
    decimals: 18,
    name: "Kava",
    symbol: "KAVA",
  },
  rpcUrls: {
    default: {
      http: ["https://kava-evm.publicnode.com"],
    },
    public: {
      http: ["https://kava-evm.publicnode.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "BlockScout",
      url: "https://kavascan.com",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 3661165,
    },
  },
})

export const bitfinityTestnet = /*#__PURE__*/ defineChain({
  id: 355113,
  name: "Bitfinity Testnet",
  network: "bitfinity-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Bitfinity",
    symbol: "BFT",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.bitfinity.network"],
    },
    public: {
      http: ["https://testnet.bitfinity.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Bitfinity",
      url: "https://explorer.bitfinity.network",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 7032,
    },
  },
})

export const x1Testnet = /*#__PURE__*/ defineChain({
  id: 195,
  name: "X1 Testnet",
  network: "x1testnet",
  nativeCurrency: {
    decimals: 18,
    name: "OKB",
    symbol: "OKB",
  },
  rpcUrls: {
    default: {
      http: ["https://testrpc.x1.tech", "https://x1testrpc.okx.com"],
    },
    public: {
      http: ["https://testrpc.x1.tech", "https://x1testrpc.okx.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "OKLink",
      url: "https://www.oklink.com/x1-test",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 624344,
    },
  },
})

export const ontology = /*#__PURE__*/ defineChain({
  id: 58,
  name: "Ontology EVM",
  network: "ontology",
  nativeCurrency: {
    decimals: 18,
    name: "ONG",
    symbol: "ONG",
  },
  rpcUrls: {
    default: {
      http: [
        "https://dappnode1.ont.io:10339",
        "https://dappnode2.ont.io:10339",
        "https://dappnode3.ont.io:10339",
        "https://dappnode4.ont.io:10339",
      ],
    },
    public: {
      http: [
        "https://dappnode1.ont.io:10339",
        "https://dappnode2.ont.io:10339",
        "https://dappnode3.ont.io:10339",
        "https://dappnode4.ont.io:10339",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Ontology",
      url: "https://explorer.ont.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0xce6292279bf688173b269df080e14407470a9e60",
      blockCreated: 14244158,
    },
  },
})

export const beraTestnet = /*#__PURE__*/ defineChain({
  id: 2061,
  name: "Berachain Testnet",
  network: "beratestnet",
  nativeCurrency: {
    decimals: 18,
    name: "BERA",
    symbol: "BERA",
  },
  rpcUrls: {
    default: {
      http: ["https://artio.rpc.berachain.com"],
    },
    public: {
      http: ["https://artio.rpc.berachain.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Beratrail",
      url: "https://artio.beratrail.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0x5406b58D03A99c7E7Ac3d59957A2822CffB8Bb34",
      blockCreated: 114673,
    },
  },
})

export const blastSepolia = /*#__PURE__*/ defineChain({
  id: 168587773,
  name: "Blast Sepolia",
  network: "blastsepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.blast.io"],
    },
    public: {
      http: ["https://sepolia.blast.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blastscan",
      url: "https://testnet.blastscan.io",
    },
  },
  testnet: true,
})
