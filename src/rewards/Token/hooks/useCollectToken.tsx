import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import useCustomPosthogEvents from "hooks/useCustomPosthogEvents"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { useToastWithShareButtons } from "hooks/useToastWithShareButtons"
import { useState } from "react"
import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { PlatformType } from "types"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import processViemContractError from "utils/processViemContractError"
import { TransactionReceipt, WriteContractParameters } from "viem"
import { usePublicClient, useWalletClient } from "wagmi"
import { Chain } from "wagmiConfig/chains"
import useTokenClaimFee from "./useClaimToken"

type ClaimResponse = {
  args: [number, number, string, number, number, `0x${string}`]
}

type Args = WriteContractParameters<typeof tokenRewardPoolAbi, "claim">["args"]

const useCollectToken = (
  chain: Chain,
  roleId?: number,
  rolePlatformId?: number,
  onSuccess?: () => void
) => {
  const { id: guildId, urlName, name } = useGuild()
  const { amount } = useTokenClaimFee(chain)

  const { captureEvent } = usePostHogContext()
  const postHogOptions = {
    guild: urlName,
    chain: chain,
  }

  const [loadingText, setLoadingText] = useState("")

  const fetcherWithSign = useFetcherWithSign()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const { rewardClaimed } = useCustomPosthogEvents()

  const collect = async () => {
    setLoadingText("Getting signature...")

    const endpoint = `/v2/guilds/${guildId}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`

    const args: Args = await fetcherWithSign([
      endpoint,
      {
        method: "POST",
        body: {},
      },
    ])
      .catch((error) => {
        showErrorToast(
          "Failed to prepare claim transaction. Please try signing in again, or contact our support team!"
        )
        captureEvent("Failed to get claim response", {
          ...postHogOptions,
          hook: "useCollectToken",
          error,
        })
        return
      })
      .then((res) => {
        if (res) {
          rewardClaimed(PlatformType.ERC20)
        }
        const data: ClaimResponse = res.data
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const [_poolId, _rolePlatformId, _amount, _signedAt, _userId, _signature] =
          data.args
        return [
          BigInt(_poolId),
          BigInt(_rolePlatformId),
          BigInt(_amount),
          BigInt(_signedAt),
          BigInt(_userId),
          _signature,
        ] satisfies Args
      })

    const claimTransactionConfig = {
      abi: tokenRewardPoolAbi,
      address: ERC20_CONTRACTS[chain],
      functionName: "claim",
      args,
      value: amount,
    } as const

    setLoadingText("Claiming tokens...")

    const { request } = await publicClient.simulateContract({
      ...claimTransactionConfig,
      /**
       * The contract's claim method uses the caller's address, so we need to pass
       * the `walletClient.account` param here
       */
      account: walletClient.account,
    })

    const hash = await walletClient.writeContract({
      ...request,
      account: walletClient.account,
    })

    const receipt: TransactionReceipt = await publicClient.waitForTransactionReceipt(
      { hash }
    )

    if (receipt.status !== "success") {
      throw new Error(`Transaction failed. Hash: ${hash}`)
    }

    return receipt
  }

  const toastWithShareButtons = useToastWithShareButtons()
  const showErrorToast = useShowErrorToast()

  return {
    ...useSubmit<undefined, TransactionReceipt>(collect, {
      onSuccess: () => {
        setLoadingText("")
        toastWithShareButtons({
          title: "Successfully claimed your tokens!",
          shareText: `Just collected my tokens in the ${name} guild!\nguild.xyz/${urlName}`,
        })

        captureEvent("Successful token claiming", {
          ...postHogOptions,
          hook: "useCollectToken",
        })
        onSuccess?.()
      },
      onError: (err) => {
        setLoadingText("")

        const prettyError = err.correlationId
          ? err
          : processViemContractError(err, (errorName) => {
              switch (errorName) {
                case "AccessDenied":
                  return "You have no access to execute this action."
                case "AlreadyClaimed":
                  return "You've already collected these tokens"
                case "AddressEmptyCode":
                  return "The user address is missing. Please try again after logging back in!"
                case "Panic":
                  return "The reward pool does not have enough tokens. The guild admin needs to fund it."
              }
            })

        captureEvent("Error while claiming token", {
          ...postHogOptions,
          hook: "useCollectToken",
          err,
        })

        showErrorToast(prettyError)
      },
    }),
    loadingText,
  }
}

export default useCollectToken
