import { BigNumberish } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { Chain, RPC } from "connectors"
import { RequirementType } from "requirements"
import {
  encodePermit2Permit,
  encodeUnwrapEth,
  encodeV2SwapExactOut,
  encodeV3SwapExactOut,
  encodeWrapEth,
  UNIVERSAL_ROUTER_COMMANDS,
} from "./encoders"

export const ZEROX_SUPPORTED_SOURCES = ["Uniswap_V2", "Uniswap_V3"] as const
export type ZeroXSupportedSources = (typeof ZEROX_SUPPORTED_SOURCES)[number]

// export const GUILD_FEE_PERCENTAGE = 0.01
// export const GUILD_FEE_FIXED_USD = 0.49
export const GUILD_FEE_PERCENTAGE = 0.02
export const GUILD_FEE_FIXED_USD = 0

export const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

export const TOKEN_BUYER_CONTRACT = "0xf8a9eef89f384601e4a19e092d2826051c50f864"

export const ZEROX_API_URLS: Partial<Record<Chain, string>> = {
  // ETHEREUM: "https://api.0x.org",
  GOERLI: "https://goerli.api.0x.org",
  // POLYGON: "https://polygon.api.0x.org",
  // BSC: "https://bsc.api.0x.org",
  // OPTIMISM: "https://optimism.api.0x.org",
  // FANTOM: "https://fantom.api.0x.org",
  // CELO: "https://celo.api.0x.org",
  // AVALANCHE: "https://avalanche.api.0x.org",
  // ARBITRUM: "https://arbitrum.api.0x.org",
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
  // ETHEREUM: "https://api.reservoir.tools",
  // GOERLI: "https://api-goerli.reservoir.tools",
  // POLYGON: "https://api-polygon.reservoir.tools",
  // OPTIMISM: "https://api-optimism.reservoir.tools",
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
  // ZETA (Görli)
  // {
  //   chainId: 5,
  //   address: "0xCc7bb2D219A0FC08033E130629C2B854b7bA9195",
  // },
  // USDC (Görli)
  {
    chainId: 5,
    address: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
  },
  // USDC
  // {
  //   chainId: 1,
  //   address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  // },
  // // DAI
  // {
  //   chainId: 1,
  //   address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  // },
  // // DAI (Görli)
  // {
  //   chainId: 5,
  //   address: "0x73967c6a0904aa032c103b4104747e88c566b1a2",
  // },
  // // USDC (Polygon)
  // {
  //   chainId: 137,
  //   address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  // },
  // // DAI (Polygon)
  // {
  //   chainId: 137,
  //   address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  // },
]

export type PurchaseAssetData = {
  chainId: number
  account: string
  tokenBuyerContract: Contract
  tokenAddress: string
  amountIn: BigNumberish // amount which we got back from the 0x API (in WEI)
  amountInWithFee: BigNumberish // amount which we got back from the 0x API + Guild fee (in WEI)
  amountOut: BigNumberish // token amount which we'd like to purchase (in WEI)
  source: ZeroXSupportedSources
  path: string
  tokenAddressPath: string[]
}

export type BuyTokenType = "COIN" | "ERC20"

export const permit2PermitFakeParams: [
  string,
  number,
  number,
  string,
  string,
  string
] = [
  "1461501637330902918203684832716283019655932542975",
  1706751423,
  0,
  "0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5",
  "1704161223",
  "0x43d422359b743755a8c8de3cd7b54c20c381084ce597d8135a3051382c96a2344d6d236a3f4a685c91bb036780ca7f90d69cbe9df8982ec022b6990f7f9b22751c",
]

const {
  WRAP_ETH,
  UNWRAP_WETH,
  V2_SWAP_EXACT_OUT,
  V3_SWAP_EXACT_OUT,
  PERMIT2_PERMIT,
} = UNIVERSAL_ROUTER_COMMANDS

export const getAssetsCallParams: Record<
  BuyTokenType,
  Record<
    ZeroXSupportedSources,
    {
      commands: string
      getEncodedParams: (
        data: Omit<PurchaseAssetData, "tokenBuyerContract">
      ) => string[]
    }
  >
> = {
  COIN: {
    Uniswap_V2: {
      commands: WRAP_ETH + V2_SWAP_EXACT_OUT + UNWRAP_WETH,
      getEncodedParams: ({ account, amountIn, amountOut, tokenAddressPath }) => [
        encodeWrapEth("0x0000000000000000000000000000000000000002", amountIn),
        encodeV2SwapExactOut(account, amountOut, amountIn, tokenAddressPath, false),
        encodeUnwrapEth(account, 0),
      ],
    },
    Uniswap_V3: {
      commands: WRAP_ETH + V3_SWAP_EXACT_OUT + UNWRAP_WETH,
      getEncodedParams: ({ account, amountIn, amountOut, path }) => [
        encodeWrapEth("0x0000000000000000000000000000000000000002", amountIn),
        encodeV3SwapExactOut(account, amountOut, amountIn, path, false),
        encodeUnwrapEth(account, 0),
      ],
    },
  },
  ERC20: {
    Uniswap_V2: {
      commands: PERMIT2_PERMIT + V2_SWAP_EXACT_OUT,
      getEncodedParams: ({
        account,
        amountIn,
        amountOut,
        tokenAddress,
        tokenAddressPath,
      }) => [
        encodePermit2Permit(tokenAddress, ...permit2PermitFakeParams),
        encodeV2SwapExactOut(account, amountOut, amountIn, tokenAddressPath, false),
      ],
    },
    Uniswap_V3: {
      commands: PERMIT2_PERMIT + V3_SWAP_EXACT_OUT,
      getEncodedParams: ({ account, amountIn, amountOut, path, tokenAddress }) => [
        encodePermit2Permit(tokenAddress, ...permit2PermitFakeParams),
        encodeV3SwapExactOut(account, amountOut, amountIn, path, false),
      ],
    },
  },
}
