import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import { useReadContract } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"

const useTokenClaimFee = (chain: Chain) => {
  const feeTransactionConfig = {
    abi: tokenRewardPoolAbi,
    address: ERC20_CONTRACTS[chain],
    functionName: "fee",
    chainId: Chains[chain],
  } as const
  const { data: amount, isLoading, error } = useReadContract(feeTransactionConfig)
  return { amount, isLoading, error }
}

export default useTokenClaimFee
