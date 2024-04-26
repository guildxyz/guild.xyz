import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import { useReadContract } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"

const useTokenClaimFee = (chain: Chain) => {
  const { data: amount, ...rest } = useReadContract({
    abi: tokenRewardPoolAbi,
    address: ERC20_CONTRACTS[chain],
    functionName: "fee",
    chainId: Chains[chain],
  })
  return { amount, ...rest }
}

export default useTokenClaimFee
