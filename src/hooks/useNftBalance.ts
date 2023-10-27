import { erc721ABI, useChainId, useContractRead } from "wagmi"

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

  return useContractRead({
    abi: erc721ABI,
    chainId,
    address: nftAddress,
    functionName: "balanceOf",
    args: [address],
    enabled: Boolean(nftAddress && address),
  })
}

export default useNftBalance
