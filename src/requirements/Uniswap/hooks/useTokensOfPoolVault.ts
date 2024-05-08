import UNISWAP_V3_POSITIONS_VAULT_ABI from "static/abis/uniswapV3PositionsVault"
import { useReadContracts } from "wagmi"

export function useTokensOfPoolVault(
  chainId: number,
  lpVaultAddress: `0x${string}`
) {
  const vaultContract = {
    address: lpVaultAddress,
    chainId,
    abi: UNISWAP_V3_POSITIONS_VAULT_ABI,
  } as const

  const {
    isLoading,
    data: [
      { result: token0 = null, error: token0Error = null } = {},
      { result: token1 = null, error: token1Error = null } = {},
      { result: fee = null } = {},
    ] = [],
  } = useReadContracts({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    contracts: [
      { ...vaultContract, functionName: "token0" },
      { ...vaultContract, functionName: "token1" },
      { ...vaultContract, functionName: "fee" },
    ],
    query: { enabled: !!lpVaultAddress, staleTime: Infinity },
  })
  const tokenError = token0Error ?? token1Error

  return {
    fee,
    token0,
    token1,
    tokenError,
    isLoading,
  }
}
