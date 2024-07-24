import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import { Chain } from "wagmiConfig/chains"

const useWithdrawPool = (chain: Chain, poolId: bigint, onSuccess: () => void) => {
  const showErrorToast = useShowErrorToast()

  const { captureEvent } = usePostHogContext()
  const postHogOptions = {
    chain: chain,
    poolId: poolId,
    hook: "useWithdrawPool",
  }

  const transactionConfig = {
    abi: tokenRewardPoolAbi,
    address: ERC20_CONTRACTS[chain],
    functionName: "withdraw",
    args: [poolId],
  }

  return useSubmitTransaction(transactionConfig, {
    onError: (error) => {
      showErrorToast("Failed to withdraw from pool! Please try again later.")
      captureEvent("Failed to withdraw from pool", { ...postHogOptions, error })
      console.error(error)
    },
    onSuccess: () => {
      captureEvent("Funds withdrawn from pool", { ...postHogOptions })
      onSuccess()
    },
  })
}

export default useWithdrawPool
