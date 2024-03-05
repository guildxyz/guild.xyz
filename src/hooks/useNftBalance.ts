import { erc721Abi } from "viem"
import { useChainId, useReadContract } from "wagmi"

const useNftBalance = ({
  nftAddress,
  address,
  chainId: chainIdFromParam,
}: {
  nftAddress: `0x${string}`
  address: `0x${string}`
  chainId?: number
}) => {
  const chainIdFromHook = useChainId()
  const chainId = chainIdFromParam ?? chainIdFromHook

  return useReadContract({
    abi: erc721Abi,
    chainId,
    address: nftAddress,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: Boolean(nftAddress && address),
    },
  })
}

export default useNftBalance
