import useUser from "components/[guild]/hooks/useUser"
import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import { formatUnits } from "viem"
import { useReadContracts } from "wagmi"
import { type Chain } from "wagmiConfig/chains"

const useTokenClaimedAmount = (
  chain: Chain,
  poolId: number,
  rolePlatformIds: number[],
  decimals: number
) => {
  const { id: userId } = useUser()

  const { data, ...rest } = useReadContracts({
    allowFailure: false,
    query: {
      enabled:
        !!chain && !!poolId && !!userId && rolePlatformIds.length > 0 && !!decimals,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    contracts: rolePlatformIds.map((platformId) => ({
      abi: tokenRewardPoolAbi,
      address: ERC20_CONTRACTS[chain],
      functionName: "getClaimedAmount",
      args: [BigInt(poolId), userId ? BigInt(userId) : 0, BigInt(platformId)],
    })),
  })

  return {
    data: data?.map((res) =>
      res ? Number(formatUnits(BigInt(res), decimals)) : null
    ),
    ...rest,
  }
}

export default useTokenClaimedAmount
