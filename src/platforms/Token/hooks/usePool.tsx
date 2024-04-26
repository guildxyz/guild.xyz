import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import { useReadContract } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"

const usePool = (chain: Chain, poolId: bigint) =>
  useReadContract({
    chainId: Chains[chain],
    abi: tokenRewardPoolAbi,
    address: ERC20_CONTRACTS[chain],
    functionName: "getPool",
    args: [poolId],
  })

export default usePool
