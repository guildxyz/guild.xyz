import { Chain } from "@guildxyz/types"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"

const useWithdrawPool = (chain: Chain, poolId: bigint, onSuccess: () => void) => {
  const showErrorToast = useShowErrorToast()

  const transactionConfig = {
    abi: tokenRewardPoolAbi,
    address: ERC20_CONTRACTS[chain],
    functionName: "withdraw",
    args: [poolId],
  }

  return useSubmitTransaction(transactionConfig, {
    onError: (error) => {
      showErrorToast("Failed to withdraw from pool! Please try again later.")
      console.error(error)
    },
    onSuccess: (_, events) => {
      if (process.env.NEXT_PUBLIC_MOCK_CONNECTOR) {
        return
      }
      onSuccess()
    },
  })
}

export default useWithdrawPool
