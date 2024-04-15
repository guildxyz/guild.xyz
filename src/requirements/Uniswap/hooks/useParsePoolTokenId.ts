import { useMemo } from "react"
import { useWatch } from "react-hook-form"

export const UNISWAP_POOL_URL = /https:\/\/app\.uniswap\.org\/pools\/([0-9]+)/i

export function useParsePoolTokenId(baseFieldPath: string) {
  const lpVaultInputValue = useWatch({ name: `${baseFieldPath}.data.lpVault` })

  const tokenId = useMemo(() => {
    if (!lpVaultInputValue || typeof lpVaultInputValue !== "string") return null
    const [, match] = lpVaultInputValue.match(UNISWAP_POOL_URL) || []
    if (!match) return null
    return +match
  }, [lpVaultInputValue])

  return tokenId
}
