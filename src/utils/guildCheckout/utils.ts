import { consts } from "@guildxyz/types"
import { CHAIN_CONFIG, Chain } from "wagmiConfig/chains"
import { GuildPinsSupportedChain } from "./constants"

export type GeneratedGetAssetsParams =
  | {
      params: [
        bigint,
        {
          tokenAddress: `0x${string}`
          amount: bigint
        },
        `0x${string}`,
        `0x${string}`[],
      ]
      value?: bigint
    }
  | {
      params: [
        {
          tokenAddress: `0x${string}`
          amount: bigint
        },
        `0x${string}`,
        `0x${string}`[],
      ]
      value?: bigint
    }

export const isGuildPinSupportedChain = (
  chain?: Chain | string
): chain is GuildPinsSupportedChain => {
  if (!chain) return false
  return Object.keys(consts.PinContractAddresses).includes(chain)
}

export const fetchNativeCurrencyPriceInUSD = async (chain: Chain) =>
  fetch(
    `https://api.coinbase.com/v2/exchange-rates?currency=${CHAIN_CONFIG[chain].nativeCurrency.symbol}`
  )
    .then((coinbaseRes) => coinbaseRes.json())
    .then((coinbaseData) => coinbaseData.data.rates.USD)
    .catch((_) => undefined)
