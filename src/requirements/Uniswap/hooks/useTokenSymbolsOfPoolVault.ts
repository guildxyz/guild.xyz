import { useSymbolsOfPair } from "./useSymbolsOfPair"
import { useTokensOfPoolVault } from "./useTokensOfPoolVault"

export function useTokenSymbolsOfPoolVault(
  chainId: number,
  lpVaultAddress: `0x${string}`
) {
  const {
    token0,
    token1,
    tokenError,
    isLoading: areTokensLoading,
  } = useTokensOfPoolVault(chainId, lpVaultAddress)

  const {
    isLoading: areSymbolsLoading,
    symbol0,
    symbol1,
  } = useSymbolsOfPair(chainId, token0, token1)

  return {
    isLoading: areTokensLoading || areSymbolsLoading,
    error: tokenError,
    symbol0,
    symbol1,
    token0,
    token1,
  }
}
