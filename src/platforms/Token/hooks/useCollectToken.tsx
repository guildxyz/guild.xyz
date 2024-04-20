import { useTransactionStatusContext } from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { useToastWithTweetButton } from "hooks/useToast"
import { useState } from "react"
import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { useFetcherWithSign } from "utils/fetcher"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import { TransactionReceipt } from "viem"
import { usePublicClient, useWalletClient } from "wagmi"
import { Chain } from "wagmiConfig/chains"
import useTokenClaimFee from "./useClaimToken"

type ClaimResponse = {
  amount: string
  poolId: number
  rolePlatformId: number
  signature: `0x${string}`
  signedAt: number
  userId: number
}

const useCollectToken = (chain: Chain, roleId?: number, rolePlatformId?: number) => {
  const { id: guildId } = useGuild()
  const { setTxHash, setTxError, setTxSuccess } = useTransactionStatusContext() ?? {}

  const { amount } = useTokenClaimFee(chain)

  const [loadingText, setLoadingText] = useState("")

  const fetcherWithSign = useFetcherWithSign()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const collect = async () => {
    setTxError(false)
    setTxSuccess(false)

    setLoadingText("Verifying signature...")

    const endpoint = `/v2/guilds/${guildId}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`
    const response = await fetcherWithSign([
      endpoint,
      {
        method: "POST",
        body: {},
      },
    ])
    const data: ClaimResponse = response.data

    const claimArgs = [
      BigInt(data.poolId),
      BigInt(data.rolePlatformId),
      BigInt(data.amount),
      BigInt(data.signedAt),
      BigInt(data.userId),
      data.signature,
    ] as const

    const claimTransactionConfig = {
      abi: tokenRewardPoolAbi,
      address: ERC20_CONTRACTS[chain],
      functionName: "claim",
      args: claimArgs,
      value: amount,
    } as const

    setLoadingText("Claiming tokens...")

    const { request } = await publicClient.simulateContract({
      ...claimTransactionConfig,
      account: walletClient.account,
    })

    if (process.env.NEXT_PUBLIC_MOCK_CONNECTOR) {
      return Promise.resolve({} as TransactionReceipt)
    }

    const hash = await walletClient.writeContract({
      ...request,
      account: walletClient.account,
    })

    setTxHash(hash)

    const receipt: TransactionReceipt = await publicClient.waitForTransactionReceipt(
      { hash }
    )

    if (receipt.status !== "success") {
      throw new Error(`Transaction failed. Hash: ${hash}`)
    }

    setTxSuccess(true)

    return receipt
  }

  const tweetToast = useToastWithTweetButton()
  const showErrorToast = useShowErrorToast()

  return {
    ...useSubmit<undefined, TransactionReceipt>(collect, {
      onSuccess: () => {
        setLoadingText("")
        tweetToast({
          title: "Successfully claimed your tokens!",
          tweetText: `Just collected my tokens!`,
        })
      },
      onError: (err) => {
        setLoadingText("")
        setTxError(true)

        console.error(err)

        showErrorToast(err)
      },
    }),
    loadingText,
  }
}

export default useCollectToken
