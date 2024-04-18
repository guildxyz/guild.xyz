import { Chain } from "@guildxyz/types"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import { findEvent } from "./useRegisterPool"

const useFundPool = (
  chain: Chain,
  poolId: bigint,
  amount: bigint,
  onSuccess: () => void
) => {
  const showErrorToast = useShowErrorToast()

  const transactionConfig = {
    abi: tokenRewardPoolAbi,
    address: ERC20_CONTRACTS[chain],
    functionName: "fundPool",
    args: [poolId, amount],
  }

  return useSubmitTransaction(transactionConfig, {
    onError: (error) => {
      showErrorToast("Failed to fund pool! Please try again later.")
      console.error(error)
    },
    onSuccess: (_, events) => {
      if (process.env.NEXT_PUBLIC_MOCK_CONNECTOR) {
        return
      }

      const poolFundedEvent = findEvent<typeof tokenRewardPoolAbi, "PoolFunded">(
        events as [],
        "PoolFunded"
      )

      if (!poolFundedEvent) {
        showErrorToast("Failed to fund pool! Please try again later.")
        return
      }

      onSuccess()
    },
  })
}

export default useFundPool
