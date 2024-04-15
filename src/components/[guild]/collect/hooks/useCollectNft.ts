import { useTransactionStatusContext } from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusContext"
import { CONTRACT_CALL_ARGS_TO_SIGN } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useNftBalance from "hooks/useNftBalance"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { useToastWithTweetButton } from "hooks/useToast"
import { useState } from "react"
import guildRewardNftAbi from "static/abis/guildRewardNft"
import { useFetcherWithSign } from "utils/fetcher"
import processViemContractError from "utils/processViemContractError"
import { TransactionReceipt } from "viem"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import { useCollectNftContext } from "../components/CollectNftContext"
import useGuildFee from "./useGuildFee"
import useTopCollectors from "./useTopCollectors"

type ClaimData = {
  // signed value which we need to send in the contract call
  uniqueValue: `0x${string}`
}

const useCollectNft = () => {
  const { captureEvent } = usePostHogContext()
  const { id: guildId, urlName } = useGuild()
  const { id: userId } = useUser()
  const postHogOptions = { guild: urlName }

  const tweetToast = useToastWithTweetButton()
  const showErrorToast = useShowErrorToast()

  const { address, chainId, status } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const { chain, nftAddress, roleId, rolePlatformId, guildPlatform } =
    useCollectNftContext()
  const { setTxHash, setTxError, setTxSuccess } = useTransactionStatusContext() ?? {}

  const { guildFee } = useGuildFee(chain)
  const { fee, name, refetch: refetchNftDetails } = useNftDetails(chain, nftAddress)
  const { mutate: mutateTopCollectors } = useTopCollectors()

  const shouldSwitchChain = chainId !== Chains[chain]

  const [loadingText, setLoadingText] = useState("")
  const fetcherWithSign = useFetcherWithSign()

  const { refetch: refetchBalance } = useNftBalance({
    nftAddress,
    chainId: Chains[chain],
  })

  const mint = async () => {
    setTxError(false)
    setTxSuccess(false)

    if (shouldSwitchChain)
      return Promise.reject("Please switch network before minting")

    setLoadingText("Claiming NFT")

    const { uniqueValue }: ClaimData = await fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`,
      {
        body: {
          args: CONTRACT_CALL_ARGS_TO_SIGN[
            guildPlatform?.platformGuildData?.function
          ],
        },
      },
    ])

    const claimFee =
      typeof guildFee === "bigint" && typeof fee === "bigint"
        ? guildFee + fee
        : BigInt(0)

    const claimParams = [address, BigInt(userId), uniqueValue] as const

    const { request } = await publicClient.simulateContract({
      abi: guildRewardNftAbi,
      address: nftAddress,
      functionName: "claim",
      args: claimParams,
      value: claimFee,
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

  return {
    ...useSubmit<undefined, TransactionReceipt>(mint, {
      onSuccess: () => {
        setLoadingText("")

        refetchBalance()
        refetchNftDetails()

        mutateTopCollectors(
          (prevValue) => ({
            topCollectors: [
              ...(prevValue?.topCollectors ?? []),
              address?.toLowerCase(),
            ],
            uniqueCollectors: (prevValue?.uniqueCollectors ?? 0) + 1,
          }),
          {
            revalidate: false,
          }
        )

        captureEvent("Minted NFT (GuildCheckout)", postHogOptions)

        tweetToast({
          title: "Successfully collected NFT!",
          tweetText: `Just collected my ${name} NFT!\nguild.xyz/${urlName}/collect/${chain.toLowerCase()}/${nftAddress.toLowerCase()}`,
        })
      },
      onError: (error) => {
        setLoadingText("")
        setTxError(true)

        const prettyError = error.correlationId
          ? error
          : processViemContractError(error, (errorName) => {
              if (errorName === "AlreadyClaimed")
                return "You've already collected this NFT"
            })
        showErrorToast(prettyError)

        captureEvent("Mint NFT error (GuildCheckout)", {
          ...postHogOptions,
          error: prettyError,
          originalError: error,
          wagmiAccountStatus: status,
        })
      },
    }),
    loadingText,
  }
}

export default useCollectNft
