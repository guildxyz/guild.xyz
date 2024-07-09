import { erc721Abi } from "viem"
import { useReadContracts } from "wagmi"

export function useSymbolsOfPair(
  chainId: number,
  token0: `0x${string}` | null,
  token1: `0x${string}` | null
) {
  const tokenContract = {
    functionName: "symbol",
    chainId,
    abi: erc721Abi,
  } as const

  const {
    isLoading,
    data: [{ result: symbol0 = null } = {}, { result: symbol1 = null } = {}] = [],
  } = useReadContracts({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    contracts: [
      { ...tokenContract, address: token0 ?? undefined },
      { ...tokenContract, address: token1 ?? undefined },
    ],
    query: { enabled: !!token0 && !!token1, staleTime: Infinity },
  })

  return {
    isLoading,
    symbol0,
    symbol1,
  }
}
