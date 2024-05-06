import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import { useReadContract } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"

const usePool = (chain: Chain, poolId: bigint) => {
  const { data, isLoading, error, refetch } = useReadContract({
    chainId: Chains[chain],
    abi: tokenRewardPoolAbi,
    address: ERC20_CONTRACTS[chain],
    functionName: "getPool",
    args: [poolId],
  })

  return {
    data: {
      owner: data?.[0],
      token: data?.[1],
      totalFunding: data?.[2],
      balance: data?.[3],
    },
    isLoading,
    error,
    refetch,
  }
}

export default usePool
