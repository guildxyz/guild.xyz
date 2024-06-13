import { useEffect } from "react"
import { useTokensOfPoolVault } from "./useTokensOfPoolVault"

export function useTokenSymbolsOfPoolVault(
  chainId: number,
  lpVaultAddress: `0x${string}`,
  onSuccess?: (data: [`0x${string}`, `0x${string}`, number]) => void
) {
  const {
    token0,
    token1,
    tokenError,
    isLoading: areTokensLoading,
    fee,
  } = useTokensOfPoolVault(chainId, lpVaultAddress)

  useEffect(() => {
    if (!token0 || !token1) {
      return
    }
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    onSuccess?.([token0, token1, fee])
  }, [onSuccess, token0, token1, fee])

  return {
    isLoading: areTokensLoading,
    error: tokenError,
  }
}
