import { bobaAvax, exosama, palm, scrollAlpha } from "static/customChains"
import { Chain as ViemChain } from "viem"
import {
  arbitrum,
  arbitrumNova,
  avalanche,
  base,
  baseGoerli,
  boba,
  bsc,
  celo,
  cronos,
  evmos,
  fantom,
  gnosis,
  goerli,
  harmonyOne,
  mainnet,
  metis,
  moonbeam,
  moonriver,
  optimism,
  polygon,
  polygonMumbai,
  polygonZkEvm,
  sepolia,
  zetachainAthensTestnet,
  zkSync,
  zora,
} from "viem/chains"

const CHAIN_CONFIG: Record<Chain, ViemChain> = {
  ETHEREUM: mainnet,
  BSC: bsc,
  POLYGON: polygon,
  POLYGON_ZKEVM: polygonZkEvm,
  AVALANCHE: avalanche,
  GNOSIS: gnosis,
  FANTOM: fantom,
  ARBITRUM: arbitrum,
  NOVA: arbitrumNova,
  CELO: celo,
  HARMONY: harmonyOne,
  OPTIMISM: optimism,
  MOONBEAM: moonbeam,
  MOONRIVER: moonriver,
  METIS: metis,
  CRONOS: cronos,
  BOBA: boba,
  BOBA_AVAX: bobaAvax,
  PALM: palm,
  BASE_GOERLI: baseGoerli,
  EXOSAMA: exosama,
  EVMOS: evmos,
  ZETACHAIN_ATHENS: zetachainAthensTestnet,
  SCROLL_ALPHA: scrollAlpha,
  ZKSYNC_ERA: zkSync,
  SEPOLIA: sepolia,
  GOERLI: goerli,
  POLYGON_MUMBAI: polygonMumbai,
  BASE_MAINNET: base,
  ZORA: zora,
}

enum Chains {
  ETHEREUM = mainnet.id,
  BSC = bsc.id,
  POLYGON = polygon.id,
  AVALANCHE = avalanche.id,
  GNOSIS = gnosis.id,
  FANTOM = fantom.id,
  ARBITRUM = arbitrum.id,
  NOVA = arbitrumNova.id,
  CELO = celo.id,
  HARMONY = harmonyOne.id,
  OPTIMISM = optimism.id,
  MOONBEAM = moonbeam.id,
  MOONRIVER = moonriver.id,
  METIS = metis.id,
  CRONOS = cronos.id,
  BOBA = boba.id,
  BOBA_AVAX = bobaAvax.id,
  PALM = palm.id,
  BASE_GOERLI = baseGoerli.id,
  EXOSAMA = exosama.id,
  EVMOS = evmos.id,
  ZETACHAIN_ATHENS = zetachainAthensTestnet.id,
  SCROLL_ALPHA = scrollAlpha.id,
  ZKSYNC_ERA = zkSync.id,
  SEPOLIA = sepolia.id,
  GOERLI = goerli.id,
  POLYGON_MUMBAI = polygonMumbai.id,
  BASE_MAINNET = base.id,
  ZORA = zora.id,
  POLYGON_ZKEVM = polygonZkEvm.id,
}

export type Chain = keyof typeof Chains

const chainIconUrls: Record<Chain, string> = {
  ETHEREUM: "/networkLogos/ethereum.svg",
  GOERLI: "/networkLogos/ethereum.svg",
  SEPOLIA: "/networkLogos/ethereum.svg",
  BSC: "/networkLogos/bsc.svg",
  POLYGON: "/networkLogos/polygon.svg",
  POLYGON_ZKEVM: "/networkLogos/polygon.svg",
  POLYGON_MUMBAI: "/networkLogos/polygon.svg",
  AVALANCHE: "/networkLogos/avalanche.svg",
  GNOSIS: "/networkLogos/gnosis.svg",
  FANTOM: "/networkLogos/fantom.svg",
  ARBITRUM: "/networkLogos/arbitrum.svg",
  NOVA: "/networkLogos/nova.svg",
  CELO: "/networkLogos/celo.svg",
  HARMONY: "/networkLogos/harmony.svg",
  OPTIMISM: "/networkLogos/optimism.svg",
  MOONBEAM: "/networkLogos/moonbeam.svg",
  MOONRIVER: "/networkLogos/moonriver.svg",
  METIS: "/networkLogos/metis.svg",
  CRONOS: "/networkLogos/cronos.svg",
  BOBA: "/networkLogos/boba.svg",
  BOBA_AVAX: "/networkLogos/boba.svg",
  PALM: "/networkLogos/palm.png",
  EXOSAMA: "/networkLogos/exosama.png",
  EVMOS: "/networkLogos/evmos.svg",
  BASE_MAINNET: "/networkLogos/base.svg",
  BASE_GOERLI: "/networkLogos/base.svg",
  ZETACHAIN_ATHENS: "/networkLogos/zetachain.svg",
  SCROLL_ALPHA: "/networkLogos/scroll.png",
  ZKSYNC_ERA: "/networkLogos/zksync-era.svg",
  ZORA: "/networkLogos/zora.svg",
}

const coinIconUrls: Record<Chain, string> = {
  ETHEREUM:
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  GOERLI:
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  SEPOLIA:
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  BSC: "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615",
  POLYGON:
    "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
  POLYGON_ZKEVM:
    "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
  POLYGON_MUMBAI:
    "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
  AVALANCHE:
    "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
  GNOSIS:
    "https://assets.coingecko.com/coins/images/11062/small/xdai.png?1614727492",
  FANTOM:
    "https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558015016",
  ARBITRUM:
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  NOVA: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  CELO: "https://assets.coingecko.com/coins/images/11090/small/icon-celo-CELO-color-500.png?1592293590",
  HARMONY:
    "https://assets.coingecko.com/coins/images/4344/small/Y88JAze.png?1565065793",
  OPTIMISM:
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  MOONBEAM:
    "https://assets.coingecko.com/coins/images/22459/small/glmr.png?1641880985",
  MOONRIVER:
    "https://assets.coingecko.com/coins/images/17984/small/9285.png?1630028620",
  METIS:
    "https://assets.coingecko.com/coins/images/15595/small/metis.PNG?1621298076",
  CRONOS:
    "https://assets.coingecko.com/coins/images/7310/small/oCw2s3GI_400x400.jpeg?1645172042",
  BOBA: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  BOBA_AVAX:
    "https://assets.coingecko.com/coins/images/20285/small/BOBA.png?1636811576",
  PALM: "/networkLogos/palm.png",
  EXOSAMA:
    "https://raw.githubusercontent.com/nico-ma1/Exosama-Network-Brand/main/sama-token%403x.png",
  EVMOS: "/networkLogos/evmos.svg",
  BASE_MAINNET:
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  BASE_GOERLI:
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  ZETACHAIN_ATHENS: "https://explorer.zetachain.com/img/logos/zeta-logo.svg",
  SCROLL_ALPHA:
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  ZKSYNC_ERA:
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  ZORA: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
}

const blockExplorerIcons: Record<Chain, { light: string; dark: string }> = {
  ETHEREUM: {
    light: "/explorerLogos/etherscan-light.svg",
    dark: "/explorerLogos/etherscan-dark.svg",
  },
  GOERLI: {
    light: "/explorerLogos/etherscan-light.svg",
    dark: "/explorerLogos/etherscan-dark.svg",
  },
  SEPOLIA: {
    light: "/explorerLogos/etherscan-light.svg",
    dark: "/explorerLogos/etherscan-dark.svg",
  },
  BSC: {
    light: "/networkLogos/polygon.svg",
    dark: "/networkLogos/polygon.svg",
  },
  POLYGON: {
    light: "/networkLogos/polygon.svg",
    dark: "/networkLogos/polygon.svg",
  },
  POLYGON_ZKEVM: {
    light: "/networkLogos/polygon.svg",
    dark: "/networkLogos/polygon.svg",
  },
  POLYGON_MUMBAI: {
    light: "/networkLogos/polygon.svg",
    dark: "/networkLogos/polygon.svg",
  },
  AVALANCHE: {
    light: "/explorerLogos/snowtrace.svg",
    dark: "/explorerLogos/snowtrace.svg",
  },
  GNOSIS: {
    light: "/networkLogos/gnosis.svg",
    dark: "/networkLogos/gnosis.svg",
  },
  FANTOM: {
    light: "/explorerLogos/ftmscan.svg",
    dark: "/networkLogos/fantom.svg",
  },
  ARBITRUM: {
    light: "/networkLogos/arbitrum.svg",
    dark: "/networkLogos/arbitrum.svg",
  },
  NOVA: {
    light: "/networkLogos/nova.svg",
    dark: "/networkLogos/nova.svg",
  },
  CELO: {
    light: "/networkLogos/celo.svg",
    dark: "/networkLogos/celo.svg",
  },
  HARMONY: {
    light: "/networkLogos/harmony.svg",
    dark: "/networkLogos/harmony.svg",
  },
  OPTIMISM: {
    light: "/networkLogos/optimism.svg",
    dark: "/networkLogos/optimism.svg",
  },
  MOONBEAM: {
    light: "/networkLogos/moonbeam.svg",
    dark: "/networkLogos/moonbeam.svg",
  },
  MOONRIVER: {
    light: "/networkLogos/moonriver.svg",
    dark: "/networkLogos/moonriver.svg",
  },
  METIS: {
    light: "/networkLogos/metis.svg",
    dark: "/explorerLogos/metis-dark.svg",
  },
  CRONOS: {
    light: "/networkLogos/cronos.svg",
    dark: "/explorerLogos/cronos-dark.svg",
  },
  BOBA: {
    light: "/explorerLogos/boba-light.svg",
    dark: "/networkLogos/boba.svg",
  },
  BOBA_AVAX: {
    light: "/explorerLogos/boba-light.svg",
    dark: "/networkLogos/boba.svg",
  },
  PALM: {
    light: "/networkLogos/palm.png",
    dark: "/networkLogos/palm.png",
  },
  EXOSAMA: {
    light: "/networkLogos/exosama.png",
    dark: "/networkLogos/exosama.png",
  },
  EVMOS: {
    light: "/networkLogos/evmos.svg",
    dark: "/networkLogos/evmos.svg",
  },
  BASE_MAINNET: {
    light: "/networkLogos/base.svg",
    dark: "/networkLogos/base.svg",
  },
  BASE_GOERLI: {
    light: "/networkLogos/base.svg",
    dark: "/networkLogos/base.svg",
  },
  ZETACHAIN_ATHENS: {
    light: "/networkLogos/zetachain.svg",
    dark: "/networkLogos/zetachain.svg",
  },
  SCROLL_ALPHA: {
    light: "/networkLogos/scroll.png",
    dark: "/networkLogos/scroll.png",
  },
  ZKSYNC_ERA: {
    light: "/networkLogos/zksync-era.svg",
    dark: "/networkLogos/zksync-era.svg",
  },
  ZORA: {
    light: "/networkLogos/zora.svg",
    dark: "/networkLogos/zora.svg",
  },
}

const etherscanApiUrls: Partial<Record<Chain, string>> = {
  ETHEREUM: "https://api.etherscan.io",
  GOERLI: "https://api-goerli.etherscan.io",
  SEPOLIA: "https://api-sepolia.etherscan.io",
  BSC: "https://api.bscscan.com",
  POLYGON: "https://api.polygonscan.com",
  POLYGON_MUMBAI: "https://api-testnet.polygonscan.com",
  AVALANCHE: "https://api.snowtrace.io",
  GNOSIS: "https://api.gnosisscan.io",
  FANTOM: "https://api.ftmscan.com",
  ARBITRUM: "https://api.arbiscan.io",
  NOVA: "https://api-nova.arbiscan.io",
  CELO: "https://explorer.celo.org",
  OPTIMISM: "https://api-optimistic.etherscan.io",
  MOONBEAM: "https://api-moonbeam.moonscan.io",
  MOONRIVER: "https://api-moonriver.moonscan.io",
  METIS: "https://andromeda-explorer.metis.io",
  CRONOS: "https://cronos.org/explorer",
  BOBA: "https://api.bobascan.com",
  BOBA_AVAX: "https://blockexplorer.avax.boba.network",
  PALM: "https://explorer.palm.io",
  EXOSAMA: "https://explorer.exosama.com",
  BASE_MAINNET: "https://api.basescan.org",
  BASE_GOERLI: "https://api-goerli.basescan.org",
  ZETACHAIN_ATHENS: "https://api-sepolia.etherscan.io",
} as const

const RPC = {
  ETHEREUM: {
    chainId: 1,
    chainName: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000", // needed for proper form handling in the TokenForm component
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://etherscan.io"],
    blockExplorerIcons: {
      light: "/explorerLogos/etherscan-light.svg",
      dark: "/explorerLogos/etherscan-dark.svg",
    },
    apiUrl: "https://api.etherscan.io",
    iconUrls: ["/networkLogos/ethereum.svg"],
    rpcUrls: [
      process.env.MAINNET_ALCHEMY_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.MAINNET_ALCHEMY_KEY}`
        : "https://cloudflare-eth.com",
    ],
  },
  BSC: {
    chainId: 56,
    chainName: "BSC",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615",
    },
    rpcUrls: ["https://binance.llamarpc.com"],
    blockExplorerUrls: ["https://bscscan.com"],
    blockExplorerIcons: {
      light: "/explorerLogos/bscscan-light.svg",
      dark: "/explorerLogos/bscscan-dark.svg",
    },
    apiUrl: "https://api.bscscan.com",
    iconUrls: ["/networkLogos/bsc.svg"],
  },
  POLYGON: {
    chainId: 137,
    chainName: "Polygon",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
    },
    rpcUrls: [
      process.env.POLYGON_ALCHEMY_KEY
        ? `https://polygon-mainnet.g.alchemy.com/v2/${process.env.POLYGON_ALCHEMY_KEY}`
        : "https://polygon-rpc.com",
    ],
    blockExplorerUrls: ["https://polygonscan.com"],
    blockExplorerIcons: {
      light: "/networkLogos/polygon.svg",
      dark: "/networkLogos/polygon.svg",
    },
    apiUrl: "https://api.polygonscan.com",
    iconUrls: ["/networkLogos/polygon.svg"],
  },
  POLYGON_ZKEVM: {
    chainId: 1101,
    chainName: "Polygon zkEVM",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: ["https://zkevm-rpc.com"],
    blockExplorerUrls: ["https://zkevm.polygonscan.com"],
    blockExplorerIcons: {
      light: "/networkLogos/polygon.svg",
      dark: "/networkLogos/polygon.svg",
    },
    // apiUrl: "https://api.polygonscan.com",
    iconUrls: ["/networkLogos/polygon.svg"],
  },
  AVALANCHE: {
    chainId: 43114,
    chainName: "Avalanche Mainnet",
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io"],
    blockExplorerIcons: {
      light: "/explorerLogos/snowtrace.svg",
      dark: "/explorerLogos/snowtrace.svg",
    },
    apiUrl: "https://api.snowtrace.io",
    iconUrls: ["/networkLogos/avalanche.svg"],
  },
  GNOSIS: {
    chainId: 100,
    chainName: "Gnosis",
    nativeCurrency: {
      name: "Gnosis",
      symbol: "Gnosis",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/11062/small/xdai.png?1614727492",
    },
    rpcUrls: ["https://rpc.gnosischain.com"],
    blockExplorerUrls: ["https://gnosisscan.io"],
    blockExplorerIcons: {
      light: "/networkLogos/gnosis.svg",
      dark: "/networkLogos/gnosis.svg",
    },
    apiUrl: "https://api.gnosisscan.io",
    iconUrls: ["/networkLogos/gnosis.svg"],
  },
  FANTOM: {
    chainId: 250,
    chainName: "Fantom Opera",
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558015016",
    },
    rpcUrls: ["https://rpc.ftm.tools"],
    blockExplorerUrls: ["https://ftmscan.com"],
    blockExplorerIcons: {
      light: "/explorerLogos/ftmscan.svg",
      dark: "/networkLogos/fantom.svg",
    },
    apiUrl: "https://api.ftmscan.com",
    iconUrls: ["/networkLogos/fantom.svg"],
  },
  ARBITRUM: {
    chainId: 42161,
    chainName: "Arbitrum One",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: [
      process.env.ARBITRUM_ALCHEMY_KEY
        ? `https://arb-mainnet.g.alchemy.com/v2/${process.env.ARBITRUM_ALCHEMY_KEY}`
        : "https://arbitrum.public-rpc.com",
    ],
    blockExplorerUrls: ["https://arbiscan.io"],
    blockExplorerIcons: {
      light: "/networkLogos/arbitrum.svg",
      dark: "/networkLogos/arbitrum.svg",
    },
    apiUrl: "https://api.arbiscan.io",
    iconUrls: ["/networkLogos/arbitrum.svg"],
  },
  NOVA: {
    chainId: 42170,
    chainName: "Arbitrum Nova",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: ["https://nova.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://nova.arbiscan.io"],
    blockExplorerIcons: {
      light: "/networkLogos/nova.svg",
      dark: "/networkLogos/nova.svg",
    },
    apiUrl: "https://api-nova.arbiscan.io",
    iconUrls: ["/networkLogos/nova.svg"],
  },
  CELO: {
    chainId: 42220,
    chainName: "Celo Mainnet",
    nativeCurrency: {
      name: "Celo",
      symbol: "CELO",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/11090/small/icon-celo-CELO-color-500.png?1592293590",
    },
    rpcUrls: ["https://forno.celo.org"],
    blockExplorerUrls: ["https://explorer.celo.org"],
    blockExplorerIcons: {
      light: "/networkLogos/celo.svg",
      dark: "/networkLogos/celo.svg",
    },
    apiUrl: "https://explorer.celo.org",
    iconUrls: ["/networkLogos/celo.svg"],
  },
  HARMONY: {
    chainId: 1666600000,
    chainName: "Harmony",
    nativeCurrency: {
      name: "Harmony",
      symbol: "ONE",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/4344/small/Y88JAze.png?1565065793",
    },
    rpcUrls: ["https://api.harmony.one"],
    blockExplorerUrls: ["https://explorer.harmony.one"],
    blockExplorerIcons: {
      light: "/networkLogos/harmony.svg",
      dark: "/networkLogos/harmony.svg",
    },
    iconUrls: ["/networkLogos/harmony.svg"],
  },
  OPTIMISM: {
    chainId: 10,
    chainName: "Optimism",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    blockExplorerIcons: {
      light: "/networkLogos/optimism.svg",
      dark: "/networkLogos/optimism.svg",
    },
    apiUrl: "https://api-optimistic.etherscan.io",
    iconUrls: ["/networkLogos/optimism.svg"],
    rpcUrls: ["https://optimism.publicnode.com"],
  },
  MOONBEAM: {
    chainId: 1284,
    chainName: "Moonbeam",
    nativeCurrency: {
      name: "Moonbeam",
      symbol: "GLMR",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000", // needed for proper form handling in the TokenForm component
      logoURI:
        "https://assets.coingecko.com/coins/images/22459/small/glmr.png?1641880985",
    },
    blockExplorerUrls: ["https://moonbeam.moonscan.io"],
    blockExplorerIcons: {
      light: "/networkLogos/moonbeam.svg",
      dark: "/networkLogos/moonbeam.svg",
    },
    apiUrl: "https://api-moonbeam.moonscan.io",
    iconUrls: ["/networkLogos/moonbeam.svg"],
    rpcUrls: ["https://rpc.api.moonbeam.network"],
  },
  MOONRIVER: {
    chainId: 1285,
    chainName: "Moonriver",
    nativeCurrency: {
      name: "Moonriver",
      symbol: "MOVR",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/17984/small/9285.png?1630028620",
    },
    blockExplorerUrls: ["https://moonriver.moonscan.io"],
    blockExplorerIcons: {
      light: "/networkLogos/moonriver.svg",
      dark: "/networkLogos/moonriver.svg",
    },
    apiUrl: "https://api-moonriver.moonscan.io",
    iconUrls: ["/networkLogos/moonriver.svg"],
    rpcUrls: ["https://rpc.api.moonriver.moonbeam.network"],
  },
  METIS: {
    chainId: 1088,
    chainName: "Metis Andromeda",
    nativeCurrency: {
      name: "Metis",
      symbol: "METIS",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/15595/small/metis.PNG?1621298076",
    },
    blockExplorerUrls: ["https://andromeda-explorer.metis.io"],
    blockExplorerIcons: {
      light: "/networkLogos/metis.svg",
      dark: "/explorerLogos/metis-dark.svg",
    },
    apiUrl: "https://andromeda-explorer.metis.io",
    iconUrls: ["/networkLogos/metis.svg"],
    rpcUrls: ["https://andromeda.metis.io/?owner=1088"],
  },
  CRONOS: {
    chainId: 25,
    chainName: "Cronos Mainnet",
    nativeCurrency: {
      name: "Cronos",
      symbol: "CRO",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/7310/small/oCw2s3GI_400x400.jpeg?1645172042",
    },
    blockExplorerUrls: ["https://cronos.org/explorer"],
    blockExplorerIcons: {
      light: "/networkLogos/cronos.svg",
      dark: "/explorerLogos/cronos-dark.svg",
    },
    apiUrl: "https://cronos.org/explorer",
    iconUrls: ["/networkLogos/cronos.svg"],
    rpcUrls: ["https://evm.cronos.org"],
  },
  BOBA: {
    chainId: 288,
    chainName: "Boba Network",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://blockexplorer.boba.network"],
    blockExplorerIcons: {
      light: "/explorerLogos/boba-light.svg",
      dark: "/networkLogos/boba.svg",
    },
    apiUrl: "https://api.bobascan.com",
    iconUrls: ["/networkLogos/boba.svg"],
    rpcUrls: ["https://mainnet.boba.network"],
  },
  BOBA_AVAX: {
    chainId: 43288,
    chainName: "Boba-Avax L2",
    nativeCurrency: {
      name: "Boba",
      symbol: "BOBA",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/20285/small/BOBA.png?1636811576",
    },
    blockExplorerUrls: ["https://blockexplorer.avax.boba.network"],
    blockExplorerIcons: {
      light: "/explorerLogos/boba-light.svg",
      dark: "/networkLogos/boba.svg",
    },
    apiUrl: "https://blockexplorer.avax.boba.network",
    iconUrls: ["/networkLogos/boba.svg"],
    rpcUrls: ["https://avax.boba.network"],
  },
  PALM: {
    chainId: 11297108109,
    chainName: "Palm",
    nativeCurrency: {
      name: "Palm",
      symbol: "PALM",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI: "/networkLogos/palm.png",
    },
    blockExplorerUrls: ["https://explorer.palm.io"],
    blockExplorerIcons: {
      light: "/networkLogos/palm.png",
      dark: "/networkLogos/palm.png",
    },
    apiUrl: "https://explorer.palm.io",
    iconUrls: ["/networkLogos/palm.png"],
    rpcUrls: ["https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b"],
  },
  EXOSAMA: {
    chainId: 2109,
    chainName: "Exosama Network",
    nativeCurrency: {
      name: "Moonsama",
      symbol: "SAMA",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://raw.githubusercontent.com/nico-ma1/Exosama-Network-Brand/main/sama-token%403x.png",
    },
    blockExplorerUrls: ["https://explorer.exosama.com"],
    blockExplorerIcons: {
      light: "/networkLogos/exosama.png",
      dark: "/networkLogos/exosama.png",
    },
    apiUrl: "https://explorer.exosama.com",
    iconUrls: ["/networkLogos/exosama.png"],
    rpcUrls: ["https://rpc.exosama.com"],
  },
  EVMOS: {
    chainId: 9001,
    chainName: "Evmos",
    nativeCurrency: {
      name: "Evmos",
      symbol: "EVMOS",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI: "/networkLogos/evmos.svg",
    },
    blockExplorerUrls: ["https://escan.live"],
    blockExplorerIcons: {
      light: "/networkLogos/evmos.svg",
      dark: "/networkLogos/evmos.svg",
    },
    iconUrls: ["/networkLogos/evmos.svg"],
    rpcUrls: ["https://eth.bd.evmos.org:8545"],
  },
  BASE_MAINNET: {
    chainId: 8453,
    chainName: "Base",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://basescan.org"],
    blockExplorerIcons: {
      light: "/networkLogos/base.svg",
      dark: "/networkLogos/base.svg",
    },
    apiUrl: "https://api.basescan.org",
    iconUrls: ["/networkLogos/base.svg"],
    rpcUrls: ["https://developer-access-mainnet.base.org"],
  },
  BASE_GOERLI: {
    chainId: 84531,
    chainName: "Base Testnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://goerli.basescan.org"],
    blockExplorerIcons: {
      light: "/networkLogos/base.svg",
      dark: "/networkLogos/base.svg",
    },
    apiUrl: "https://api-goerli.basescan.org",
    iconUrls: ["/networkLogos/base.svg"],
    rpcUrls: ["https://goerli.base.org"],
  },
  ZETACHAIN_ATHENS: {
    chainId: 7001,
    chainName: "ZetaChain Athens",
    nativeCurrency: {
      name: "aZETA",
      symbol: "aZETA",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI: "https://explorer.zetachain.com/img/logos/zeta-logo.svg",
    },
    rpcUrls: ["https://api.athens2.zetachain.com/evm"],
    blockExplorerUrls: ["https://explorer.zetachain.com"],
    blockExplorerIcons: {
      light: "/networkLogos/zetachain.svg",
      dark: "/networkLogos/zetachain.svg",
    },
    iconUrls: ["/networkLogos/zetachain.svg"],
  },
  SCROLL_ALPHA: {
    chainId: 534353,
    chainName: "Scroll Alpha",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: ["https://alpha-rpc.scroll.io/l2"],
    blockExplorerUrls: ["https://blockscout.scroll.io"],
    blockExplorerIcons: {
      light: "/networkLogos/scroll.png",
      dark: "/networkLogos/scroll.png",
    },
    iconUrls: ["/networkLogos/scroll.png"],
  },
  ZKSYNC_ERA: {
    chainId: 324,
    chainName: "zkSync Era",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: ["https://mainnet.era.zksync.io"],
    blockExplorerUrls: ["https://explorer.zksync.io"],
    blockExplorerIcons: {
      light: "/networkLogos/zksync-era.svg",
      dark: "/networkLogos/zksync-era.svg",
    },
    iconUrls: ["/networkLogos/zksync-era.svg"],
  },
  ZORA: {
    chainId: 7777777,
    chainName: "Zora",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: ["https://rpc.zora.energy"],
    blockExplorerUrls: ["https://explorer.zora.energy"],
    blockExplorerIcons: {
      light: "/networkLogos/zora.svg",
      dark: "/networkLogos/zora.svg",
    },
    iconUrls: ["/networkLogos/zora.svg"],
  },
  SEPOLIA: {
    chainId: 11155111,
    chainName: "Sepolia",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: ["https://endpoints.omniatech.io/v1/eth/sepolia/public"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    blockExplorerIcons: {
      light: "/explorerLogos/etherscan-light.svg",
      dark: "/explorerLogos/etherscan-dark.svg",
    },
    apiUrl: "https://api-sepolia.etherscan.io",
    iconUrls: ["/networkLogos/ethereum.svg"],
  },
  GOERLI: {
    chainId: 5,
    chainName: "Goerli",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: [
      process.env.GOERLI_ALCHEMY_KEY
        ? `https://eth-goerli.g.alchemy.com/v2/${process.env.GOERLI_ALCHEMY_KEY}`
        : // : "https://ethereum-goerli-rpc.allthatnode.com",
          "https://ethereum-goerli.publicnode.com",
    ],
    blockExplorerUrls: ["https://goerli.etherscan.io"],
    blockExplorerIcons: {
      light: "/explorerLogos/etherscan-light.svg",
      dark: "/explorerLogos/etherscan-dark.svg",
    },
    apiUrl: "https://api-goerli.etherscan.io",
    iconUrls: ["/networkLogos/ethereum.svg"],
  },
  POLYGON_MUMBAI: {
    chainId: 80001,
    chainName: "Mumbai",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    blockExplorerIcons: {
      light: "/networkLogos/polygon.svg",
      dark: "/networkLogos/polygon.svg",
    },
    apiUrl: "https://api-testnet.polygonscan.com",
    iconUrls: ["/networkLogos/polygon.svg"],
  },
}

const supportedChains = Object.keys(RPC) as Chain[]

export {
  CHAIN_CONFIG,
  Chains,
  blockExplorerIcons,
  chainIconUrls,
  coinIconUrls,
  etherscanApiUrls,
  supportedChains,
}
