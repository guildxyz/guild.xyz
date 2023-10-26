import {
  bobaAvax,
  exosama,
  neonEVM,
  palm,
  pgn,
  scrollAlpha,
} from "static/customChains"
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
  PGN: pgn,
  NEON_EVM: neonEVM,
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
  PGN = pgn.id,
  NEON_EVM = neonEVM.id,
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
  PGN: "/networkLogos/pgn.svg",
  NEON_EVM: "/networkLogos/neon.svg",
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
  PGN: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  NEON_EVM:
    "https://assets.coingecko.com/coins/images/28331/standard/neon_%281%29.png?1696527338",
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
  PGN: {
    light: "/networkLogos/pgn-light.svg",
    dark: "/networkLogos/pgn.svg",
  },
  NEON_EVM: {
    light: "/explorerLogos/neonscan.svg",
    dark: "/explorerLogos/neonscan.svg",
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

const supportedChains = Object.keys(CHAIN_CONFIG) as Chain[]

export {
  CHAIN_CONFIG,
  Chains,
  blockExplorerIcons,
  chainIconUrls,
  coinIconUrls,
  etherscanApiUrls,
  supportedChains,
}
