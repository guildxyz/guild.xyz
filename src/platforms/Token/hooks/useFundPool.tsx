import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { ERC20_CONTRACTS, NULL_ADDRESS } from "utils/guildCheckout/constants"
import { Chain } from "wagmiConfig/chains"
import { findEvent } from "./useRegisterPool"

const useFundPool = (
  chain: Chain,
  tokenAddress: `0x${string}`,
  poolId: bigint,
  amount: bigint,
  onSuccess: () => void
) => {
  const showErrorToast = useShowErrorToast()

  const tokenIsNative = tokenAddress === NULL_ADDRESS

  const transactionConfig = {
    abi: tokenRewardPoolAbi,
    address: ERC20_CONTRACTS[chain],
    functionName: "fundPool",
    args: [poolId, amount],
    ...(tokenIsNative && { value: amount }),
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
