import { consts } from "@guildxyz/types"
import { useEffect } from "react"
import UNISWAP_V3_POSITIONS_NFT_ABI from "static/abis/uniswapV3PositionsNFT"
import { useReadContract } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import { useSymbolsOfPair } from "./useSymbolsOfPair"

export function usePairOfTokenId(
  chain: keyof typeof consts.UniswapV3PositionsAddresses,
  tokenId: number,
  onSuccess?: (positions: [`0x${string}`, `0x${string}`]) => void
) {
  const enabled = typeof tokenId === "number"

  const {
    isLoading,
    data: [, , token0, token1] = [],
    error,
  } = useReadContract({
    address: consts.UniswapV3PositionsAddresses[chain],
    chainId: Chains[chain],
    abi: UNISWAP_V3_POSITIONS_NFT_ABI,
    functionName: "positions",
    args: [enabled ? BigInt(tokenId) : undefined],
    query: { enabled },
  })

  const {
    isLoading: areSymbolsLoading,
    symbol0,
    symbol1,
  } = useSymbolsOfPair(Chains[chain], token0, token1)

  useEffect(() => {
    if (!token0 || !token1) return
    onSuccess?.([token0, token1])
  }, [token0, token1, onSuccess])

  return {
    symbol0,
    symbol1,
    error,
    isLoading: isLoading || areSymbolsLoading,
  }
}
