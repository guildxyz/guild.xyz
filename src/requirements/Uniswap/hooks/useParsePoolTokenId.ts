import { useMemo } from "react"
import { useWatch } from "react-hook-form"
import { UNISWAP_POOL_URL } from "./useParsePoolChain"

export function useParsePoolTokenId(baseFieldPath: string) {
  const lpVaultInputValue = useWatch({ name: `${baseFieldPath}.data.lpVault` })

  const tokenId = useMemo(() => {
    if (!lpVaultInputValue || typeof lpVaultInputValue !== "string") return null

    const [, match] = lpVaultInputValue.match(UNISWAP_POOL_URL) || []

    if (!match) return null
    const parsedTokenId = +match
    return parsedTokenId
  }, [lpVaultInputValue])

  return tokenId
}
