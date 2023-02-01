import { Chain, RPC } from "connectors"
import { RequirementType } from "requirements"

export const TOKEN_BUYER_CONTRACT = "0x8c82a71b629db618847682cd3155e6742304b710"

export const ZEROX_API_URLS: Partial<Record<Chain, string>> = {
  ETHEREUM: "https://api.0x.org",
  GOERLI: "https://goerli.api.0x.org",
  POLYGON: "https://polygon.api.0x.org",
  BSC: "https://bsc.api.0x.org",
  OPTIMISM: "https://optimism.api.0x.org",
  FANTOM: "https://fantom.api.0x.org",
  CELO: "https://celo.api.0x.org",
  AVALANCHE: "https://avalanche.api.0x.org",
  ARBITRUM: "https://arbitrum.api.0x.org",
}

export const ZEROX_EXCLUDED_SOURCES = [
  "Native",
  "Uniswap",
  "Eth2Dai",
  "Kyber",
  "Curve",
  "LiquidityProvider",
  "MultiBridge",
  "Balancer",
  "Balancer_V2",
  "CREAM",
  "Bancor",
  "MakerPsm",
  "mStable",
  "Mooniswap",
  "MultiHop",
  "Shell",
  "Swerve",
  "SnowSwap",
  "SushiSwap",
  "DODO",
  "DODO_V2",
  "CryptoCom",
  "Linkswap",
  "KyberDMM",
  "Smoothy",
  "Component",
  "Saddle",
  "xSigma",
  "Curve_V2",
  "Lido",
  "ShibaSwap",
  "Clipper",
  "PancakeSwap",
  "PancakeSwap_V2",
  "BakerySwap",
  "Nerve",
  "Belt",
  "Ellipsis",
  "ApeSwap",
  "CafeSwap",
  "CheeseSwap",
  "JulSwap",
  "ACryptoS",
  "QuickSwap",
  "ComethSwap",
  "Dfyn",
  "WaultSwap",
  "Polydex",
  "FirebirdOneSwap",
  "JetSwap",
  "IronSwap",
  "Synapse",
  "GMX",
  "Aave_V3",
]

export const RESERVOIR_API_URLS: Partial<Record<Chain, string>> = {
  ETHEREUM: "https://api.reservoir.tools",
  GOERLI: "https://api-goerli.reservoir.tools",
  POLYGON: "https://api-polygon.reservoir.tools",
  OPTIMISM: "https://api-optimism.reservoir.tools",
}

export const purchaseSupportedChains: Partial<Record<RequirementType, string[]>> = {
  ERC20: Object.keys(ZEROX_API_URLS),
  ERC721: Object.keys(RESERVOIR_API_URLS),
  ERC1155: Object.keys(RESERVOIR_API_URLS),
}

export const allPurchaseSupportedChains: Chain[] = [
  ...new Set(Object.values(purchaseSupportedChains).flat()),
] as Chain[]

export const PURCHASABLE_REQUIREMENT_TYPES: RequirementType[] = [
  "ERC20",
  "ERC721",
  "ERC1155",
]

export const SUPPORTED_CURRENCIES: { chainId: number; address: string }[] = [
  // Add native currencies automatically
  ...allPurchaseSupportedChains.map((c) => ({
    chainId: RPC[c].chainId,
    address: RPC[c].nativeCurrency.symbol,
  })),
  // USDC
  {
    chainId: 1,
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  // DAI
  {
    chainId: 1,
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  // DAI (Görli)
  {
    chainId: 5,
    address: "0x73967c6a0904aa032c103b4104747e88c566b1a2",
  },
  // USDC (Polygon)
  {
    chainId: 137,
    address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  },
  // DAI (Polygon)
  {
    chainId: 137,
    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  },
]

export const PROTOCOL_FEES_PERCENTAGE = {
  UNISWAP_V2: 0.3,
  UNISWAP_V3: 0.05, // 0.05%, 0.30%, and 1% (pooltól függően)
  SEAPORT: 0,
  LOOKS_RARE: 2,
  NFTX: 5, // 5% Minting Fee , 0% Random Redemption Fee, 5% Targeted Redemption Fee
  CRYPTOPUNKS: 0,
  X2Y2: 0.5,
  SUDOSWAP: 0.5,
  NFT20: 5,
  FOUNDATION: 0, // up to 15% a ToS alapján (de ahogy nézem opcionális, párat megnéztem és ott nem láttam)
}
