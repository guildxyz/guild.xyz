import { erc721Abi } from "viem"
import { useAccount, useReadContract } from "wagmi"

const useNftBalance = ({
  nftAddress,
  chainId: chainIdFromParam,
}: {
  nftAddress: `0x${string}`
  chainId?: number
}) => {
  const { address, chainId: chainIdFromHook } = useAccount()
  const chainId = chainIdFromParam ?? chainIdFromHook

  return useReadContract({
    abi: erc721Abi,
    chainId,
    address: nftAddress,
    functionName: "balanceOf",
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    args: [address],
    query: {
      enabled: Boolean(nftAddress && address),
    },
  })
}

export default useNftBalance
