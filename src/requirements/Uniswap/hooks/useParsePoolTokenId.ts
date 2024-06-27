import { consts } from "@guildxyz/types"
import { useMemo } from "react"
import { useWatch } from "react-hook-form"

export const UNISWAP_POOL_URL = /https:\/\/app\.uniswap\.org\/pools\/([0-9]+)/i

export type UniswapChains = (typeof consts.UniswapV3PositionsChains)[number]

const uniswapParamToChainName = {
  mainnet: "ETHEREUM",
  sepolia: "SEPOLIA",
  polygon: "POLYGON",
  bnb: "BSC",
  arbitrum: "ARBITRUM",
  optimism: "OPTIMISM",
  celo: "CELO",
  base: "BASE_MAINNET",
} as const satisfies Record<string, UniswapChains>

function tryToParseChain(input: string) {
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

export function useParsePoolTokenId(
  baseFieldPath: string,
  onChainFound?: (
    chainName: UniswapChains
  ) => void
) {
  const lpVaultInputValue = useWatch({ name: `${baseFieldPath}.data.lpVault` })

  const tokenId = useMemo(() => {
    if (!lpVaultInputValue || typeof lpVaultInputValue !== "string") return null
    const [, match] = lpVaultInputValue.match(UNISWAP_POOL_URL) || []
    if (!match) return null
    const parsedTokenId = +match
    const parsedChain = tryToParseChain(lpVaultInputValue)

    if (parsedChain) {
      onChainFound(parsedChain)
    }

    return parsedTokenId
  }, [lpVaultInputValue, onChainFound])

  return tokenId
}
