import { BigNumberish } from "@ethersproject/bignumber"
import { Chain, RPC } from "connectors"
import { RequirementType } from "requirements"
import GUILD_CREDENTIAL_ABI from "static/abis/guildCredential.json"
import OLD_TOKEN_BUYER_ABI from "static/abis/oldTokenBuyerAbi.json"
import TOKEN_BUYER_ABI from "static/abis/tokenBuyerAbi.json"
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
      address: string
      abi: object
    }
  >
>

export const ZEROX_SUPPORTED_SOURCES = ["Uniswap_V2", "Uniswap_V3"] as const
export type ZeroXSupportedSources = (typeof ZEROX_SUPPORTED_SOURCES)[number]

export const GUILD_FEE_PERCENTAGE = 0.01

export const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

const DEFAULT_TOKEN_BUYER_CONTRACTS: TokenBuyerContractConfig = {
  ETHEREUM: {
    address: "0x4aff02d7aa6be3ef2b1df629e51dcc9109427a07",
    abi: TOKEN_BUYER_ABI,
  },
  POLYGON: {
    address: "0x151c518390d38487a4ddcb02e3f156a77c184cb9",
    abi: TOKEN_BUYER_ABI,
  },
  ARBITRUM: {
    address: "0xe6e6b676f94a6207882ac92b6014a391766fa96e",
    abi: OLD_TOKEN_BUYER_ABI,
  },
  GOERLI: {
    address: "0x1eeaab336061d64f1d271eed529991f7ae7cc478",
    abi: TOKEN_BUYER_ABI,
  },
}

const SPECIAL_TOKEN_BUYER_CONTRACTS: Record<number, TokenBuyerContractConfig> = {
  // Alongside - TODO
  // 7635: {
  //   ...DEFAULT_TOKEN_BUYER_CONTRACTS,
  //   ETHEREUM: {
  //     address: "0x4aff02d7aa6be3ef2b1df629e51dcc9109427a07",
  //     abi: TOKEN_BUYER_ABI,
  //   },
  //   POLYGON: {
  //     address: "0x151c518390d38487a4ddcb02e3f156a77c184cb9",
  //     abi: TOKEN_BUYER_ABI,
  //   },
  // },
}

export const getTokenBuyerContractData = (
  guildId?: number
): TokenBuyerContractConfig =>
  SPECIAL_TOKEN_BUYER_CONTRACTS[guildId] ?? DEFAULT_TOKEN_BUYER_CONTRACTS

export const ZEROX_API_URLS: Partial<Record<Chain, string>> = {
  ETHEREUM: "https://api.0x.org",
  GOERLI: "https://goerli.api.0x.org",
  POLYGON: "https://polygon.api.0x.org",
  // BSC: "https://bsc.api.0x.org",
  // OPTIMISM: "https://optimism.api.0x.org",
  // FANTOM: "https://fantom.api.0x.org",
  // CELO: "https://celo.api.0x.org",
  // AVALANCHE: "https://avalanche.api.0x.org",
  ARBITRUM: "https://arbitrum.api.0x.org",
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

export const SUPPORTED_CURRENCIES: { chainId: number; address: string }[] = [
  // Add native currencies automatically
  ...allPurchaseSupportedChains.map((c) => ({
    chainId: RPC[c].chainId,
    address: RPC[c].nativeCurrency.symbol,
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
  "0x00",
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
      getEncodedParams: (data: PurchaseAssetData) => string[]
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

export const DISABLED_TOKENS: Partial<Record<Chain, string[]>> = {
  ETHEREUM: [
    "0x0e42acbd23faee03249daff896b78d7e79fbd58e",
    "0x5b272ce3e225b019a3fbd968206824b24c674344",
    "0x87165b659ba7746907a48763063efa3b323c2b07",
    "0x472d0b0ddfe0bc02c27928b8bcbd67e65d07d48a",
    "0x250316b3e46600417654b13bea68b5f64d61e609",
    "0x59c1349bc6f28a427e78ddb6130ec669c2f39b48",
    "0x742b70151cd3bc7ab598aaff1d54b90c3ebc6027",
    "0x93dede06ae3b5590af1d4c111bc54c3f717e4b35",
    "0x0ab87046fbb341d058f17cbc4c1133f25a20a52f",
  ],
  ARBITRUM: [
    "0xf42ae1d54fd613c9bb14810b0588faaa09a426ca",
    "0x1addd80e6039594ee970e5872d247bf0414c8903",
    "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
    "0xa7af63b5154eb5d6fb50a6d70d5c229e5f030ab2",
    "0x59745774ed5eff903e615f5a2282cae03484985a",
    "0xce3b19d820cb8b9ae370e423b0a329c4314335fe",
    "0xb67c014fa700e69681a673876eb8bafaa36bff71",
    "0x68f5d998f00bb2460511021741d098c05721d8ff",
    "0xfbd849e6007f9bc3cc2d6eb159c045b8dc660268",
    "0x7d1d610fe82482412842e8110aff1cb72fa66bc8",
    "0xbabf696008ddade1e17d302b972376b8a7357698",
  ],
  POLYGON: [
    "0x3ca3218d6c52b640b0857cc19b69aa9427bc842c",
    "0x971039bf0a49c8d8a675f839739ee7a42511ec91",
    "0x9d373d22fd091d7f9a6649eb067557cc12fb1a0a",
    "0xbc4fb4ed825c65ff48163af7e59d49e32edb5269",
    "0x8b7aa8f5cc9996216a88d900df8b8a0a3905939a",
    "0x3ab2da31bbd886a7edf68a6b60d3cde657d3a15d",
    "0x0cdf4195ed44fd661b4df304fb453096671b4099",
    "0xe90056b377cbbb477e3950505ccbd8d00b9cdc75",
    "0x5a6ae1fd70d04ba4a279fc219dfabc53825cb01d",
    "0x11a83070d6f41ebe3764e4efed7df9b9d20a03fa",
  ],
}

export const FEE_COLLECTOR_CONTRACT: Partial<Record<Chain, string>> = {
  ETHEREUM: "0xe4b4c6a7c6b6396032096C12aDf46B7F14a70F4d",
  POLYGON: "0xe4b4c6a7c6b6396032096C12aDf46B7F14a70F4d",
  POLYGON_MUMBAI: "0xe4b4c6a7c6b6396032096C12aDf46B7F14a70F4d",
}
export const paymentSupportedChains: Chain[] = Object.keys(
  FEE_COLLECTOR_CONTRACT
) as Chain[]

export const GUILD_CREDENTIAL_CONTRACT = {
  // POLYGON_MUMBAI: {
  //   address: "0x807f16eba4a2c51b86cb8ec8be8eab34305c2bfd",
  //   abi: GUILD_CREDENTIAL_ABI,
  // },
  POLYGON: {
    address: "0xff04820c36759c9f5203021fe051239ad2dcca8a",
    abi: GUILD_CREDENTIAL_ABI,
  },
}
// TODO: satisfies Partial<Record<Chain, { address: string; abi: ContractInterface }>> - we just can't use it in Next.js 12, but we should add it later.

export type GuildCredentialsSupportedChain = keyof typeof GUILD_CREDENTIAL_CONTRACT
