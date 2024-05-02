import { consts } from "@guildxyz/types"
import { useEffect } from "react"
import UNISWAP_V3_POSITIONS_NFT_ABI from "static/abis/uniswapV3PositionsNFT"
import { useReadContract } from "wagmi"
import { Chains } from "wagmiConfig/chains"

export function usePairOfTokenId(
  chain: keyof typeof consts.UniswapV3PositionsAddresses,
  tokenId: number,
  onSuccess?: (positions: [`0x${string}`, `0x${string}`, number]) => void
) {
  const enabled = typeof tokenId === "number"

  const {
    isLoading,
    data: [, , token0, token1, fee] = [],
    error,
  } = useReadContract({
    address: consts.UniswapV3PositionsAddresses[chain],
    chainId: Chains[chain],
    abi: UNISWAP_V3_POSITIONS_NFT_ABI,
    functionName: "positions",
    args: [enabled ? BigInt(tokenId) : undefined],
    query: { enabled, staleTime: Infinity },
  })

  useEffect(() => {
    if (!token0 || !token1) return
    onSuccess?.([token0, token1, fee])
  }, [token0, token1, fee, onSuccess])

  return {
    error,
    isLoading: isLoading,
  }
}
