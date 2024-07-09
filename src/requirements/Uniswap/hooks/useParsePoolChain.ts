import { consts } from "@guildxyz/types"
import { useMemo } from "react"
import { useWatch } from "react-hook-form"

export const UNISWAP_POOL_URL = /https:\/\/app\.uniswap\.org\/pools\/([0-9]+)/i
export const UNISWAP_POOL_EXPLORER_URL =
  /^https:\/\/app\.uniswap\.org\/explore\/pools\/([^\/]+)\//

export type UniswapChains = (typeof consts.UniswapV3PositionsChains)[number]

const uniswapParamToChainName = {
  mainnet: "ETHEREUM",
  ethereum: "ETHEREUM",
  sepolia: "SEPOLIA",
  polygon: "POLYGON",
  bnb: "BSC",
  arbitrum: "ARBITRUM",
  optimism: "OPTIMISM",
  avalanche: "AVALANCHE",
  celo: "CELO",
  base: "BASE_MAINNET",
  blast: "BLAST_MAINNET",
} as const satisfies Record<string, UniswapChains>

function tryToParseChain(input: string) {
  const [, match] = input.match(UNISWAP_POOL_URL) || []
  if (!match) return

  try {
    const url = new URL(input)

    const chain = url.searchParams.get(
      "chain"
    ) as keyof typeof uniswapParamToChainName
    if (!chain) return null

    const chainName = uniswapParamToChainName[chain]
    if (!chainName) return null

    return chainName
  } catch {}

  return null
}

const tryParseExplorerChain = (input: string) => {
  try {
    const [, match] = input.match(UNISWAP_POOL_EXPLORER_URL) || []

    if (!match) return null
    const chain = match as keyof typeof uniswapParamToChainName
    const chainName = uniswapParamToChainName[chain]
    if (!chainName) return null

    return chainName
  } catch {}
  return null
}

const useParsePoolChain = (
  baseFieldPath: string,
  onChainFound?: (chainName: UniswapChains) => void
) => {
  const lpVaultInputValue = useWatch({ name: `${baseFieldPath}.data.lpVault` })

  const chain = useMemo(() => {
    if (!lpVaultInputValue || typeof lpVaultInputValue !== "string") return null
    const parsedChain =
      tryToParseChain(lpVaultInputValue) ?? tryParseExplorerChain(lpVaultInputValue)
    if (parsedChain) onChainFound?.(parsedChain)
    return parsedChain
  }, [lpVaultInputValue, onChainFound])

  return chain
}

export default useParsePoolChain
