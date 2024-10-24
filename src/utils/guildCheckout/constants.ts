import { consts } from "@guildxyz/types"
import { Chain } from "wagmiConfig/chains"

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
