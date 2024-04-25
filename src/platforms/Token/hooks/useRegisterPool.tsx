import { Chain } from "@guildxyz/types"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { ERC20_CONTRACTS, NULL_ADDRESS } from "utils/guildCheckout/constants"
import { Abi, ContractEventName, DecodeEventLogReturnType } from "viem"

const useRegisterPool = (
  owner: string,
  chain: Chain,
  token: `0x${string}`,
  initialTokenAmount: bigint,
  onSuccess: (poolId: string) => void
) => {
  const showErrorToast = useShowErrorToast()
  const tokenIsNative = token === NULL_ADDRESS

  const { captureEvent } = usePostHogContext()
  const postHogOptions = {
    chain: chain,
    hook: "useRegisterPool",
  }

  const transactionConfig = tokenIsNative
    ? {
        abi: tokenRewardPoolAbi,
        address: ERC20_CONTRACTS[chain],
        functionName: "registerPool",
        args: [owner, token, initialTokenAmount],
        value: initialTokenAmount,
      }
    : {
        abi: tokenRewardPoolAbi,
        address: ERC20_CONTRACTS[chain],
        functionName: "registerPool",
        args: [owner, token, initialTokenAmount],
      }

  return useSubmitTransaction(transactionConfig, {
    onError: (error) => {
      captureEvent("Failed to register pool", { ...postHogOptions, error })
      console.error(error)
    },
    onSuccess: (_, events) => {
      if (process.env.NEXT_PUBLIC_MOCK_CONNECTOR) {
        return
      }

      const poolRegisteredEvent = findEvent<
        typeof tokenRewardPoolAbi,
        "PoolRegistered"
      >(events as [], "PoolRegistered")

      if (!poolRegisteredEvent) {
        // TODO: not so client friendly error message
        captureEvent("Couldn't find 'PoolRegistered' event", { ...postHogOptions })
        showErrorToast("Couldn't find 'PoolRegistered' event")
      }

      const poolId = poolRegisteredEvent.args.poolId.toString()
      captureEvent("Registered pool", { ...postHogOptions, poolId: poolId })
      onSuccess(poolId)
    },
  })
}

export default useRegisterPool

export const findEvent = <
  TAbi extends Abi,
  TEventName extends ContractEventName<TAbi>
>(
  events: DecodeEventLogReturnType<TAbi, ContractEventName<TAbi>>[],
  eventName: TEventName
): DecodeEventLogReturnType<TAbi, TEventName> | undefined =>
  events.find((event) => event.eventName === eventName) as DecodeEventLogReturnType<
    TAbi,
    TEventName
  >
