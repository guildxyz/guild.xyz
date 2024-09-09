import { consts } from "@guildxyz/types"
import { RequirementType } from "requirements/types"
import oldTokenBuyerAbi from "static/abis/oldTokenBuyer"
import tokenBuyerAbi from "static/abis/tokenBuyer"
import { Abi, toBytes } from "viem"
import { CHAIN_CONFIG, Chain } from "wagmiConfig/chains"
import {
  UNIVERSAL_ROUTER_COMMANDS,
  encodePermit2Permit,
  encodeUnwrapEth,
  encodeV2SwapExactOut,
  encodeV3SwapExactOut,
  encodeWrapEth,
} from "./encoders"

export type TokenBuyerContractConfig = Partial<
  Record<
    Chain,
    {
      address: `0x${string}`
      abi: Abi
    }
  >
>

export const ZEROX_SUPPORTED_SOURCES = ["Uniswap_V2", "Uniswap_V3"] as const
export type ZeroXSupportedSources = (typeof ZEROX_SUPPORTED_SOURCES)[number]

export const GUILD_FEE_PERCENTAGE = 0.01

export const MIN_TOKEN_AMOUNT = 0.000001

export const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i
export const NULL_ADDRESS: `0x${string}` =
  "0x0000000000000000000000000000000000000000"

export const ERC20_CONTRACTS = {
  SEPOLIA: "0x0d72BCDA1Ec6D0E195249519fb83BB5D559E895D",
  OPTIMISM: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
  POLYGON: "0x50de43D7dEd0736D489093b4Ce28b69E300d2a14",
  BSC: "0x91764561684B0DDD7A43Bc1477C716e16c72DB7d",
  MANTLE: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
  BASE_MAINNET: "0x13ec6B98362E43Add08f7CC4f6befd02fa52eE01",
} as const satisfies Partial<Record<Chain, `0x${string}`>>

export const ERC20_SUPPORTED_CHAINS = Object.keys(
  ERC20_CONTRACTS
) as (keyof typeof ERC20_CONTRACTS)[]

export const TOKEN_BUYER_CONTRACTS: TokenBuyerContractConfig = {
  ETHEREUM: {
    address: "0x4aff02d7aa6be3ef2b1df629e51dcc9109427a07",
    abi: tokenBuyerAbi,
  },
  POLYGON: {
    address: "0x151c518390d38487a4ddcb02e3f156a77c184cb9",
    abi: tokenBuyerAbi,
  },
  ARBITRUM: {
    address: "0xe6e6b676f94a6207882ac92b6014a391766fa96e",
    abi: oldTokenBuyerAbi,
  },
  BSC: {
    address: "0xde0d301c75779423d962c2e538d0f326004e7c83",
    abi: tokenBuyerAbi,
  },
  BASE_MAINNET: {
    address: "0x44f26a7b2b58621d97240b09350b66803faa1e1a",
    abi: tokenBuyerAbi,
  },
  SEPOLIA: {
    address: "0xe62211aae2e70b86e7896400e81ce2047aca4c26",
    abi: tokenBuyerAbi,
  },
}

export const ZEROX_API_URLS: Partial<
  Record<keyof typeof TOKEN_BUYER_CONTRACTS, string>
> = {
  ETHEREUM: "https://api.0x.org",
  POLYGON: "https://polygon.api.0x.org",
  ARBITRUM: "https://arbitrum.api.0x.org",
  BASE_MAINNET: "https://base.api.0x.org",
  SEPOLIA: "https://sepolia.api.0x.org",
}

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

export const SUPPORTED_CURRENCIES: { chainId: number; address: `0x${string}` }[] = [
  // Add native currencies automatically
  ...allPurchaseSupportedChains.map((c) => ({
    chainId: CHAIN_CONFIG[c].id,
    address: NULL_ADDRESS,
  })),
  /**
   * We'll be able to add ERC20 tokens here in the following format:
   *
   * { chainId: number, address: string (token address) }
   */
]

export type PurchaseAssetData = {
  chainId: number
  account: string
  tokenAddress: string
  amountIn: bigint // amount which we got back from the 0x API (in WEI)
  amountInWithFee: bigint // amount which we got back from the 0x API + Guild fee (in WEI)
  amountOut: bigint // token amount which we'd like to purchase (in WEI)
  source: ZeroXSupportedSources
  path: string
  tokenAddressPath: string[]
}

export type BuyTokenType = "COIN" | "ERC20"

// amount: bigint, expiration: bigint, nonce: bigint, spender: string, sigDeadline: bigint, data: Uint8Array
export const permit2PermitFakeParams = [
  BigInt("1461501637330902918203684832716283019655932542975"),
  BigInt("1706751423"),
  BigInt(0),
  "0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5",
  BigInt("1704161223"),
  toBytes("0x00"),
] as const

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
      getEncodedParams: (data: PurchaseAssetData) => `0x${string}`[]
    }
  >
> = {
  COIN: {
    Uniswap_V2: {
      commands: WRAP_ETH + V2_SWAP_EXACT_OUT + UNWRAP_WETH,
      getEncodedParams: ({ account, amountIn, amountOut, tokenAddressPath }) => [
        encodeWrapEth("0x0000000000000000000000000000000000000002", amountIn),
        encodeV2SwapExactOut(account, amountOut, amountIn, tokenAddressPath, false),
        encodeUnwrapEth(account, BigInt(0)),
      ],
    },
    Uniswap_V3: {
      commands: WRAP_ETH + V3_SWAP_EXACT_OUT + UNWRAP_WETH,
      getEncodedParams: ({ account, amountIn, amountOut, path }) => [
        encodeWrapEth("0x0000000000000000000000000000000000000002", amountIn),
        encodeV3SwapExactOut(account, amountOut, amountIn, toBytes(path), false),
        encodeUnwrapEth(account, BigInt(0)),
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
        encodeV3SwapExactOut(account, amountOut, amountIn, toBytes(path), false),
      ],
    },
  },
}

export const FEE_COLLECTOR_CONTRACT = {
  ETHEREUM: "0xe4b4c6a7c6b6396032096c12adf46b7f14a70f4d",
  OPTIMISM: "0xf7c2baa81feb6dd7bda0b3a03afbc1e13f955da5",
  POLYGON: "0xe4b4c6a7c6b6396032096c12adf46b7f14a70f4d",
  SEPOLIA: "0xc3563655d35397b77228c07a7f5301b0e0fa417d",
} as const satisfies Partial<Record<Chain, `0x${string}`>>
export const paymentSupportedChains = Object.keys(
  FEE_COLLECTOR_CONTRACT
) as (keyof typeof FEE_COLLECTOR_CONTRACT)[]

export type GuildPinsSupportedChain = keyof typeof consts.PinContractAddresses

export const openseaBaseUrl: Partial<Record<Chain, string>> = {
  ETHEREUM: "https://opensea.io/assets/ethereum",
  POLYGON: "https://opensea.io/assets/matic",
  BSC: "https://opensea.io/assets/bsc",
  ARBITRUM: "https://opensea.io/assets/arbitrum",
  OPTIMISM: "https://opensea.io/assets/optimism",
  AVALANCHE: "https://opensea.io/assets/avalanche",
  BASE_MAINNET: "https://opensea.io/assets/base",
  SEPOLIA: "https://opensea.io/assets/sepolia",
}
