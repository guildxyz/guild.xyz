import { Chain } from "viem"

export const bobaAvax = {
  id: 43288,
  name: "Boba-Avax L2",
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
} as const satisfies Chain

export const palm = {
  id: 11297108109,
  name: "Palm",
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
} as const satisfies Chain

export const exosama = {
  id: 2109,
  name: "Exosama",
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
} as const satisfies Chain

export const scrollAlpha = {
  id: 534353,
  name: "Scroll Alpha",
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
} as const satisfies Chain

export const neonEVM = {
  id: 245022934,
  name: "Neon EVM",
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
} as const satisfies Chain

export const bitfinityTestnet = {
  id: 355113,
  name: "Bitfinity Testnet",
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
} as const satisfies Chain

export const ontology = {
  id: 58,
  name: "Ontology EVM",
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
} as const satisfies Chain

export const beraTestnet = {
  id: 2061,
  name: "Berachain Testnet",
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
} as const satisfies Chain

export const taikoKatlaTestnet = {
  id: 167008,
  name: "Taiko Katla Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://taiko-katla.blockpi.network/v1/rpc/public"],
    },
    public: {
      http: ["https://taiko-katla.blockpi.network/v1/rpc/public"],
    },
  },
  blockExplorers: {
    default: {
      name: "BlockScout",
      url: "https://explorer.katla.taiko.xyz",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 77870,
    },
  },
} as const satisfies Chain

export const oasisSapphire = {
  id: 23294,
  name: "Oasis Sapphire",
  nativeCurrency: {
    name: "Rose",
    symbol: "ROSE",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sapphire.oasis.io"],
    },
    public: {
      http: ["https://sapphire.oasis.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "BlockScout",
      url: "https://explorer.sapphire.oasis.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 734531,
    },
  },
} as const satisfies Chain

export const x1 = {
  id: 196,
  name: "X Layer mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "OKB",
    symbol: "OKB",
  },
  rpcUrls: {
    default: { http: ["https://xlayerrpc.okx.com"] },
  },
  blockExplorers: {
    default: {
      name: "OKLink",
      url: "https://www.oklink.com/xlayer",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 47416,
    },
  },
} as const satisfies Chain

export const formTestnet = {
  id: 132902,
  name: "Form",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://rpc.form.network/http"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://explorer.form.network",
    },
  },
  contracts: {
    multicall3: {
      address: "0xf2429187a6e6f2f7980dde17a856bd22e211d2a2",
      blockCreated: 1118269,
    },
  },
  testnet: true,
} as const satisfies Chain

export const metisSepolia = {
  id: 59902,
  name: "Metis Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Metis",
    symbol: "sMETIS",
  },
  rpcUrls: {
    default: { http: ["https://sepolia.metisdevops.link"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://sepolia-explorer.metisdevops.link",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 224185,
    },
  },
  testnet: true,
} as const satisfies Chain

export const mint = {
  id: 185,
  name: "Mint",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://rpc.mintchain.io"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://explorer.mintchain.io/",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 2239893,
    },
  },
  testnet: false,
} as const satisfies Chain

export const world = {
  id: 480,
  name: "World Chain",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://raas-backend.alchemy.com/rpc/worldchain-mainnet/rollup"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://worldchain-mainnet-explorer.alchemy.com",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 306795,
    },
  },
  testnet: false,
} as const satisfies Chain
