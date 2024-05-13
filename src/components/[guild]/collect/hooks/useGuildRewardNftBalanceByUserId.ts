import useUser from "components/[guild]/hooks/useUser"
import guildRewardNftAbi from "static/abis/guildRewardNft"
import { useReadContract } from "wagmi"

const useGuildRewardNftBalanceByUserId = ({
  nftAddress,
  chainId,
}: {
  nftAddress: `0x${string}`
  chainId: number
}) => {
  const { id: userId } = useUser()

  return useReadContract({
    abi: guildRewardNftAbi,
    address: nftAddress,
    chainId,
    functionName: "balanceOf",
    args: [BigInt(userId ?? 0)],
    query: {
      enabled: !!userId,
    },
  })
}

export default useGuildRewardNftBalanceByUserId
